import React, { useContext } from "react";
import Feed from "../Components/Feed/Feed";
import MakePost from "../Components/MakePost/MakePost";
import { Box } from "@mui/material";
import NavBar from "../Components/NavBar/NavBar";
import Page from "./Page";
import Footer from "../Components/Footer";
import AuthContext from "../Context/AuthContext";

function FeedPage() {
    const {user} = useContext(AuthContext)
  return (
    <Page className="relative bg-white">
      <NavBar />
      <div className="min-h-screen flex flex-col bg-white">
          <Box
          sx={{
              width: "100%",
              minHeight: "100vh", 
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              paddingTop: "20px",
          }}
          >

          <div className="text-center px-4">
            <h1 className="font-serif text-4xl md:text-5xl text-gray-900">Community feed</h1>
            <p className="mt-2 text-gray-600">Verified eco-actions from around campus. Double-click a photo to like it.</p>
          </div>

          {/* Create Post Button */}
          {user && <MakePost />}

          {/* Feed Section */}
          <Box
              sx={{
              width: "100%",
              maxWidth: "600px", 
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "10px",
              }}
          >
              <Feed />
          </Box>
          </Box>
        </div>
        <Footer/>
    </Page>

    
  );
}

export default FeedPage;
