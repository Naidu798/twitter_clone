const url = "http://localhost:5000";

const backendDomain = {
  auth: {
    signup: `${url}/api/auth/signup`,
    login: `${url}/api/auth/login`,
    logout: `${url}/api/auth/logout`,
    me: `${url}/api/auth/me`,
  },
  users: {
    profile: `${url}/api/users/profile`,
    suggested: `${url}/api/users/suggested`,
    followUnfollowUser: `${url}/api/users/follow`,
    updateProfile: `${url}/api/users/update-profile`,
    following: `${url}/api/users/following`,
  },
  posts: {
    userPosts: `${url}/api/posts/user`,
    followingPosts: `${url}/api/posts/following`,
    likedPosts: `${url}/api/posts/likes`,
    allPosts: `${url}/api/posts/all`,
    createPost: `${url}/api/posts/create`,
    likePost: `${url}/api/posts/like`,
    commentPost: `${url}/api/posts/comment`,
    deletePost: `${url}/api/posts`,
  },
  notifications: {
    deleteAll: `${url}/api/notifications`,
    getAll: `${url}/api/notifications/all`,
    updateStatus: `${url}/api/notifications/update-status`,
  },
};

export default backendDomain;
