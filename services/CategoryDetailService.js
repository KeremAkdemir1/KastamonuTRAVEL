
const CategoryDetailService = () => ({

    async getAllCategoryPosts(params,id) {
        const requestOptions = {
            method: 'POST',
        };
        return await fetch(`http://kastamonutravelguide.com:8080/api/v1/post/all?languageCode=${params}&categoryId=` + id,requestOptions)
    }
})

export default CategoryDetailService