import React, { useState } from "react";
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axiosInstance from "../../Context/axiosInstance";
import { toastError, toastSuccess } from "../utils/toastCustom";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// "5h ago" style timestamps
const timeAgo = (iso) => {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
};

const Post = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.liked_by_user);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [burst, setBurst] = useState(0);

  const handleLike = async () => {
    const newIsLiked = !isLiked;
    const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;
    if (newIsLiked) setBurst(Date.now());
    
    try {
      // Optimistically update UI
      setIsLiked(newIsLiked);
      setLikesCount(newLikesCount);
      
      const response = await axiosInstance({
        method: newIsLiked ? 'post' : 'delete',
        url: `/posts/${post.id}/like/`
      });
      
      if (response.status === 200) {
        toastSuccess(newIsLiked ? "Post liked!" : "Post unliked!");
      }
    } catch (error) {
      // Revert UI changes if request fails
      setIsLiked(!newIsLiked);
      setLikesCount(likesCount);
      toastError("Error toggling like!");
      console.error("Error:", error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 500,
        overflow: "hidden",
        mx: "auto",
        mt: 2,
        p: 2,
        border: "2px solid #1B6630",
        position: "relative",
        mb: 5,
      }}
    >

      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 40,
          height: 40,
          backgroundColor: post.points_received > 0 ? "#1B6630" : "#bbb",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "50%",
          fontWeight: "bold",
          fontSize: "14px",
          boxShadow: "2px 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        {post.points_received}
      </Box>


      <Box display="flex" alignItems="center" mb={2}>
        <Link 
          to={`/profile/${post.user.id}`}
          style={{ textDecoration: 'none' }}
        >
          <Avatar
            src={post.user.profile_picture}
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#1B6630",
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
          />
        </Link>
        <Link 
          to={`/profile/${post.user.id}`}
          style={{ textDecoration: 'none' }}
        >
          <Typography
            variant="h6"
            sx={{ 
              ml: 2, 
              color: "#1B6630", 
              fontWeight: "bold",
              '&:hover': {
                color: '#145022',
                textDecoration: 'underline'
              }
            }}
          >
            {post.user.username}
          </Typography>
        </Link>
        {post.created_at && (
          <Typography variant="caption" sx={{ ml: 1.5, color: "#6b7280" }}>
            {timeAgo(post.created_at)}
          </Typography>
        )}
      </Box>

            <Typography
              variant="body1"
              sx={{ color: "#1B6630", fontWeight: "bold", mt: 1 }}
            >
              {post.caption}
            </Typography>


      <Box
        sx={{
          backgroundColor: "#DEFDE9",
          borderRadius: 2,
          overflow: "hidden",
          mb: 1,
          position: "relative",
        }}
        onDoubleClick={() => !isLiked && handleLike()}
      >
        <motion.img
          src={post.image}
          alt="Post"
          style={{ width: "100%", maxHeight: 460, objectFit: "cover", display: "block" }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.4 }}
          draggable={false}
        />
        {/* heart that pops over the photo when liked (also on double-click) */}
        <AnimatePresence>
          {burst > 0 && (
            <motion.div
              key={burst}
              style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none" }}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.2, 1, 1.1] }}
              transition={{ duration: 0.9, times: [0, 0.3, 0.7, 1] }}
              onAnimationComplete={() => setBurst(0)}
            >
              <FavoriteIcon sx={{ fontSize: 110, color: "white", filter: "drop-shadow(0 6px 16px rgba(0,0,0,.35))" }} />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Like Button and Count */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <IconButton 
          onClick={handleLike}
          sx={{ 
            color: isLiked ? '#1B6630' : 'grey',
            '&:hover': {
              color: isLiked ? '#145022' : '#1B6630',
            }
          }}
        >
          <motion.span
            key={isLiked ? "on" : "off"}
            style={{ display: "inline-flex" }}
            initial={{ scale: 0.5 }}
            animate={{ scale: [0.5, 1.35, 1] }}
            transition={{ duration: 0.35 }}
          >
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </motion.span>
        </IconButton>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#1B6630',
            fontWeight: 'bold',
            ml: 1 
          }}
        >
          {likesCount} {likesCount === 1 ? 'like' : 'likes'}
        </Typography>
      </Box>

    </Box>
  );
};

export default Post;
