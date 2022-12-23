const GetFavoritesIdService = () => ({

    async GetFavorites(deviceId) {
        return await fetch(`http://kastamonutravelguide.com:8080/api/v1/post/favoriteDevice?&deviceId=` + deviceId)
    }
})

export default GetFavoritesIdService
