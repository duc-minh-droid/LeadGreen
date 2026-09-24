import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../config";
import axiosInstance from "../../Context/axiosInstance";
import useInfiniteScroll from "../../Hooks/useInfiniteScroll";
import Post from "./Post";
import LinearProgress from '@mui/material/LinearProgress';
import { Fab, Zoom, Box } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { motion } from "framer-motion";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [nextPage, setNextPage] = useState(`${BACKEND_URL}/api/posts?page=1`);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const fetchNextPage = async () => {
    if (!nextPage || isFetchingNextPage) return;
    setIsFetchingNextPage(true); // Set loading state before fetch
    
    try {
        const response = await axiosInstance.get(nextPage);
      const data = response.data;

      // Deduplicate posts 
      if (data && data.results){
        setPosts((prev) => {
          const newPosts = data.results.filter(
            (newPost) => !prev.some((existingPost) => existingPost.id === newPost.id)
          );
          return [...prev, ...newPosts];
        });
      
      // Store the URL for the next page of results (null if no more pages)
      setNextPage(data.next);
      setHasNextPage(!!data.next);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsFetchingNextPage(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (posts.length === 0) { // Only fetch if no posts exist
      fetchNextPage();
    }
  }, []);

  // When a new post is created, pull the first page again so it shows up on top
  useEffect(() => {
    const onCreated = async () => {
      try {
        const { data } = await axiosInstance.get(`${BACKEND_URL}/api/posts?page=1`);
        setPosts((prev) => [...data.results.filter((p) => !prev.some((x) => x.id === p.id)), ...prev]);
      } catch (error) {
        console.error("Error refreshing posts:", error);
      }
    };
    window.addEventListener("leadgreen:post-created", onCreated);
    return () => window.removeEventListener("leadgreen:post-created", onCreated);
  }, []);

  const observeLastElement = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage, setIsFetchingNextPage, 800);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        maxWidth: "900px",
        mx: "auto",
        p: { xs: 3, sm: 2, md: 4 },
      }}
    >
      {posts.map((post, index) => (
        <Box
          ref={index === posts.length - 1 ? observeLastElement : null}
          key={post.id}
          sx={{
            mb: { xs: 2, md: 4 },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Post post={post} />
          </motion.div>
        </Box>
      ))}

      {isFetchingNextPage && <LinearProgress color="success" />}

      <Zoom in={showScrollTop}>
        <Fab
          color="success"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 64,
            right: 20,
            backgroundColor: "#1B6630",
            padding: { xs: "10px 14px", md: "12px 20px" },
            fontSize: "16px",
            fontWeight: "bold",
            textTransform: "none",
            boxShadow: "2px 4px 8px rgba(0,0,0,0.2)",
            "&:hover": { backgroundColor: "#145022" },
            transition: "0.3s ease-in-out",
          }}
        >
          <KeyboardArrowUpIcon sx={{ fontSize: { xs: 24, md: 30 }, color: "white" }} />
        </Fab>
      </Zoom>
    </Box>
  );
};

export default Feed;