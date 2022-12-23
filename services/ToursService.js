const getAllTours = () => ({

    async getAllTours(params) {
        return await fetch('http://kastamonutravelguide.com:8080/api/v1/post/tag/4?&languageCode=' + params)
    }
})

export default getAllTours