const getAllPopulars = () => ({

    async getAllPopulars(params) {
        return await fetch('http://kastamonutravelguide.com:8080/api/v1/post/tag/3?&languageCode=' + params)
    }
})

export default getAllPopulars