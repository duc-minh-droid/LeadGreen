import { useState, useEffect} from "react";
import { BACKEND_URL } from "../config";
import { Search, ChevronUp, ChevronDown, Leaf, Trophy } from "lucide-react";
import axios from "axios";
import Page from "./Page";
import "../Components/LeaderboardPage.css";
import NavBar from "../Components/NavBar/NavBar.jsx";
import Footer from "../Components/Footer.jsx";
import TopContributorsPodium from "../Components/TopContributorsPodium";
import { Link } from "react-router-dom";

const API_BASE_URL = BACKEND_URL + "/api/leaderboard";

const LeaderboardPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("lifetime-points");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

  // Get current page and total pages from backend data
  const getPageInfo = () => {
    let currentPage = 1;
    if (nextPage) {
      const pageMatch = nextPage.match(/page=(\d+)/);
      if (pageMatch) {
        currentPage = parseInt(pageMatch[1]) - 1;
      }
    } else if (previousPage) {
      const pageMatch = previousPage.match(/page=(\d+)/);
      if (pageMatch) {
        currentPage = parseInt(pageMatch[1]) + 1;
      }
    }
    const pageSize = leaderboardData.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    return { currentPage, totalPages };
  };

  // Sorting options for the leaderboard
  const sortOptions = [
    { key: "points", label: "Point Balance" },
    { key: "tree-level", label: "Tree Level" },
    { key: "lifetime-points", label: "Overall Points" },
  ];

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Fetch leaderboard data whenever the sorting method changes
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/${sortBy}/`);
        setLeaderboardData(response.data.results || []);
        setNextPage(response.data.next);
        setPreviousPage(response.data.previous);
        setTotalCount(response.data.count);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch leaderboard data");
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [sortBy]);

  const handlePageChange = async (url) => {
    if (!url) return;
    setLoading(true);
    try {
      const response = await axios.get(url);
      setLeaderboardData(response.data.results || []);
      setNextPage(response.data.next);
      setPreviousPage(response.data.previous);
      setTotalCount(response.data.count);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch leaderboard data");
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandRow = (userRank) => {
    setExpandedRows((prev) => ({
      ...prev,
      [userRank]: !prev[userRank]
    }));
  };
  
  // Filter leaderboard based on the search term
  const filteredLeaderboard = leaderboardData.filter((user) =>
    user.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get top 3 contributors for the podium
  const topThreeContributors = leaderboardData.slice(0, 3);

  // Get medal color based on rank
  const getMedalColor = (rank) => {
    if (rank === 1) return "text-yellow-500";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-amber-600";
    return "text-green-600";
  };

  const MobileTableRow = ({ user, index }) => {
    const isExpanded = expandedRows[user.rank] || false;
    const isTopThree = user.rank <= 3;
  
    const animationDelay = `${index * 0.08}s`;

    return (
      <div
        className={`relative overflow-hidden mb-3 rounded-xl shadow-md transition-all duration-300 ${
          isExpanded ? "bg-green-50" : "bg-white"
        } ${isTopThree ? "border-l-4 border-green-500" : ""}`}
        style={{
          animationDelay,
          transform: `translateY(${isExpanded ? "0" : "0"}px)`,
          opacity: 1,
          animation: `slideInFromRight 0.5s ease-out ${animationDelay} both`,
        }}
      >
        <div
          onClick={() => toggleExpandRow(user.rank)}
          className="flex items-center justify-between p-4 cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            {/* Rank with medal for top 3 */}
            <div className="relative flex items-center justify-center w-10 h-10">
              {isTopThree ? (
                <Trophy className={`w-8 h-8 ${getMedalColor(user.rank)} animate-pulse-slow`} />
              ) : (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold">
                  {user.rank}
                </div>
              )}
            </div>

            {/* Username with subtle glow for top 3 */}
            <div>
              <Link 
                to={`/profile/${user.user.id}`}
                className={`font-semibold text-gray-800 hover:text-green-600 ${isTopThree ? "glow-text-green" : ""}`}
              >
                {user.user.username}
              </Link>
              <div className="text-xs text-gray-500 flex items-center">
                <Leaf className="w-3 h-3 text-green-500 mr-1" />
                Level {user.tree_level} Tree
              </div>
            </div>
          </div>

          {/* Points and expand icon */}
          <div className="flex items-center">
            <div className="text-right mr-2">
              <div className="font-bold text-green-600">{user.points_balance}</div>
              <div className="text-xs text-gray-500">points</div>
            </div>

            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400 transition-transform duration-300" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-300" />
            )}
          </div>
        </div>

        {/* Expanded view with enhanced animations */}
        <div
          className={`px-4 pb-4 pt-0 transition-all duration-500 ease-in-out overflow-hidden ${
            isExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="h-px bg-gray-200 mb-3 w-full"></div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm transform transition duration-300 hover:scale-105">
              <div className="text-xs text-gray-500 mb-1">Current Points</div>
              <div className="font-bold text-xl text-green-600 counter-animate">{user.points_balance}</div>
            </div>

            <div className="bg-white p-3 rounded-lg shadow-sm transform transition duration-300 hover:scale-105">
              <div className="text-xs text-gray-500 mb-1">Overall Points</div>
              <div className="font-bold text-xl text-green-700 counter-animate">{user.lifetime_points}</div>
            </div>
          </div>

          {/* Tree level visual indicator with animated fill */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Tree Level</span>
              <span>{user.tree_level}/60</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-green-500 h-2 rounded-full progress-bar-animate"
                style={{
                  width: `${(user.tree_level / 60) * 100}%`,
                  animation: isExpanded ? "growWidth 1s ease-out forwards" : "none",
                  transform: "translateX(-100%)",
                  transformOrigin: "left",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Component for desktop table row
  const DesktopTableRow = ({ user, index }) => {
    const isTopThree = user.rank <= 3;

    return (
      <div
        className="grid grid-cols-10 items-center py-3 px-4 hover:bg-green-50 transition-all duration-300 text-sm border-b border-gray-200"
        style={{
          animation: `fadeInSlideUp 0.5s ease-out ${index * 0.05}s both`,
          opacity: 0,
        }}
      >
        <div className="col-span-1 font-bold text-lg text-gray-500 flex items-center justify-center">
          {isTopThree ? (
            <Trophy className={`w-6 h-6 ${getMedalColor(user.rank)} animate-pulse-slow`} />
          ) : (
            <span>#{user.rank}</span>
          )}
        </div>
        <div className="col-span-4 font-semibold text-black text-center">
          <Link 
            to={`/profile/${user.user.id}`}
            className={`hover:text-green-600 ${isTopThree ? "glow-text-green" : ""}`}
          >
            {user.user.username}
          </Link>
        </div>
        <div className="col-span-2 text-center font-bold text-green-600">{user.points_balance}</div>
        <div className="col-span-1 text-center">
          <div className="flex items-center justify-center space-x-1">
            <Leaf className="w-4 h-4 text-green-500" />
            <span className="font-bold text-green-500">{user.tree_level}</span>
          </div>
        </div>
        <div className="col-span-2 text-center font-bold text-green-700">{user.lifetime_points}</div>
      </div>
    );
  };

  return (
    <Page className="bg-white">
      <NavBar />

      {/* Hero Section with subtle animation */}
      <section className="text-green-700 py-12 md:py-20 position-relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-title-fade-in">
            Sustainability Leaderboard
          </h1>
          <p className="text-lg md:text-xl mb-8 animate-subtitle-fade-in">
            Join the movement and make a difference!
          </p>
          <Link 
            to="/login"
            className="inline-block bg-white text-green-600 font-bold py-2 px-6 rounded-full hover:bg-green-100 transition-all shadow-md transform hover:scale-105 animate-button-pop"
          >
            Join the Challenge
          </Link>
        </div>

        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="leaf leaf-1"></div>
          <div className="leaf leaf-2"></div>
          <div className="leaf leaf-3"></div>
        </div>
      </section>

      {/* Podium Section for Top 3 Contributors */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-green-600 mb-8 animate-bounce-in">
            Top Sustainablity Champions
          </h2>
          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block w-12 h-12 relative">
                <div className="absolute inset-0 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-green-100 border-b-green-500 rounded-full animate-spin animate-delay-150"></div>
                <Leaf className="absolute inset-0 m-auto w-6 h-6 text-green-500 animate-pulse" />
              </div>
              <p className="mt-3 text-green-600">Loading top contributors...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500 bg-white rounded-lg shadow-lg p-4 m-4 animate-shake">
              <p>Sorry, there was an error loading the top contributors.</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          ) : (
            <TopContributorsPodium topContributors={topThreeContributors} />
          )}
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* <h2 className="text-2xl md:text-3xl font-bold text-center text-green-600 mb-8 animate-bounce-in">
            Top Sustainabliy Champions
          </h2> */}

          {/* Search and Sort Section */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                placeholder="Search participants..."
                className="w-full md:w-64 pl-10 pr-4 py-2 border-2 border-green-600 rounded-full text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {sortOptions.map((option, idx) => (
                <button
                  key={option.key}
                  className={`px-3 py-1 rounded-full text-sm transition-all duration-300 transform hover:scale-105 ${
                    sortBy === option.key
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-gray-200 text-gray-800 hover:bg-green-100"
                  }`}
                  style={{
                    animation: "fadeInSlideUp 0.3s ease-out forwards",
                    animationDelay: `${0.1 + idx * 0.1}s`,
                  }}
                  onClick={() => {
                    setSortBy(option.key);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Current sort indicator */}
          <div className="mb-4 text-sm text-green-700 text-center md:text-left animate-fade-in">
            Currently sorted by: {sortOptions.find((opt) => opt.key === sortBy)?.label || "Overall Points"}
          </div>

          {/* Leaderboard List */}
          <div className={`${!isMobile ? "bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-500" : ""}`}>
            {/* Desktop Headers */}
            {!isMobile && (
              <div className="hidden md:grid grid-cols-10 bg-green-600 text-white py-3 px-4 text-sm animate-fade-in">
                <div className="col-span-1 font-bold">Rank</div>
                <div className="col-span-4 font-bold text-center">Participant</div>
                <div className="col-span-2 font-bold text-center">
                  Point Balance {sortBy === "points" && "▼"}
                </div>
                <div className="col-span-1 font-bold text-center">
                  Tree Level {sortBy === "tree-level" && "▼"}
                </div>
                <div className="col-span-2 font-bold text-center">
                  Overall Balance {sortBy === "lifetime-points" && "▼"}
                </div>
              </div>
            )}

            {/* Loading state with improved spinner */}
            {loading && (
              <div className="py-12 text-center">
                <div className="inline-block w-12 h-12 relative">
                  <div className="absolute inset-0 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-4 border-green-100 border-b-green-500 rounded-full animate-spin animate-delay-150"></div>
                  <Leaf className="absolute inset-0 m-auto w-6 h-6 text-green-500 animate-pulse" />
                </div>
                <p className="mt-3 text-green-600">Loading leaderboard...</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="py-8 text-center text-red-500 bg-white rounded-lg shadow-lg p-4 m-4 animate-shake">
                <p>Sorry, there was an error loading the leaderboard.</p>
                <p className="text-sm mt-2">{error}</p>
              </div>
            )}

            {/* Responsive Table Content */}
            {!loading && !error && leaderboardData.length > 0 ? (
              <div className={`${isMobile ? "space-y-2 px-2" : ""} leaderboard-container`}>
                {leaderboardData.map((user, index) => (
                  isMobile ? (
                    <MobileTableRow key={user.id} user={user} index={index} />
                  ) : (
                    <DesktopTableRow key={user.id} user={user} index={index} />
                  )
                ))}
              </div>
            ) : (
              !loading &&
              !error && (
                <div className="py-8 text-center text-gray-500 animate-fade-in">No results found.</div>
              )
            )}
          </div>

          {/* Pagination - Improved mobile layout with animations */}
          {leaderboardData.length > 0 && (
            <div className="mt-8 px-4 animate-fade-in">
              <div className="flex justify-between items-center max-w-md mx-auto">
                <button
                  onClick={() => handlePageChange(previousPage)}
                  disabled={!previousPage}
                  className="px-4 py-2 bg-green-100 text-green-600 font-medium rounded-full disabled:bg-gray-200 disabled:text-gray-400 shadow-sm transition-all duration-300 w-24 text-center hover:shadow-md hover:bg-green-200 transform hover:scale-105 disabled:hover:scale-100 disabled:hover:shadow-sm"
                >
                  Previous
                </button>

                <div className="bg-white text-green-700 px-4 py-2 rounded-full shadow-sm text-sm font-medium transition-all duration-300 pulse-animation">
                  Page {getPageInfo().currentPage} of {getPageInfo().totalPages}
                </div>

                <button
                  onClick={() => handlePageChange(nextPage)}
                  disabled={!nextPage}
                  className="px-4 py-2 bg-green-100 text-green-600 font-medium rounded-full disabled:bg-gray-200 disabled:text-gray-400 shadow-sm transition-all duration-300 w-24 text-center hover:shadow-md hover:bg-green-200 transform hover:scale-105 disabled:hover:scale-100 disabled:hover:shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-green-600 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-fade-slide-in" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-xl font-bold mb-4">How it works</h3>
              <p>
                As you make more sustainable choices around our university campus and contribute to Exeter University's
                sustainability goals, you gradually move up the leaderboard to earn special rewards.
              </p>
            </div>
            <div className="animate-fade-slide-in" style={{ animationDelay: "0.2s" }}>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline hover:text-green-800 transition-colors duration-300">
                    Home Page
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline hover:text-green-800 transition-colors duration-300">
                    Upload your progress now
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline hover:text-green-800 transition-colors duration-300">
                    Play the game
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <Footer />
        </div>
      </footer>
    </Page>
  );
};

export default LeaderboardPage;