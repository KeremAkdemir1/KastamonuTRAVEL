const GetFavoritesService = () => ({

    async getAllFavorites(deviceId) {

        return await fetch('http://kastamonutravelguide.com:8080/api/v1/post/favoriteDevice?&deviceId=' + deviceId)
    }
})

export default GetFavoritesService
