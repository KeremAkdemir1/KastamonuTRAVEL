const PostService = () => ({

    async getAllPosts(id,params) {
        return await fetch(`http://kastamonutravelguide.com:8080/api/v1/post/favoriteDeviceDetail?deviceId=${id}&languageCode=` + params)
    }
})

export default PostService
