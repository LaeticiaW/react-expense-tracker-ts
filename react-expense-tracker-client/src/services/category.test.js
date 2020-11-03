import moxios from 'moxios'
import CategoryService from './category'

describe('Category Service Tests', () => {
    const categoryUrl = 'http://localhost:3000/category/'
      
    const categoryList = [
        {
            "name":"Travel",
            "subcategories":[
                {"id":"travel-s1","name":"Holiday Inn Express","matchText":[]},
                {"id":"travel-s2","name":"Marriott Hotel","matchText":[]},
                {"id":"travel-s3","name":"Southwest Airlines","matchText":[]}
            ],
            "_id":"2","__v":0
        },
        {
            "name":"Utilities",
            "subcategories":[
                 {"id":"utilities-s1","name":"Electric"},
                 {"id":"utilities-s2","name":"Gas","matchText":["Valero"]},
                 {"id":"utilities-s3","name":"Internet","matchText":["Spectrum"]},
                 {"id":"utilities-s4","name":"Phone","matchText":["VZWRLSS"]}
            ],
            "_id":"1","__v":0
        }        
    ]

    beforeEach(function () {
        moxios.install()
    })

    afterEach(function () {
        moxios.uninstall()
    })
    
    describe('Fetch/Set Data Tests', () => {       

        test('Retrieve the list of categories', async () => {
            expect.hasAssertions()            

            // Stub the request
            moxios.stubRequest(categoryUrl, {
                status: 200,
                response: categoryList
            })

            const data = await CategoryService.getCategories()
            
            // Verify the returned data
            expect(data.length).toEqual(2)
            expect(data[0]).toEqual(categoryList[0])
            expect(data[1]).toEqual(categoryList[1]) 

            // Verify that the returned categories are sorted by category name
            expect(data[0].name).toEqual('Travel')
            expect(data[1].name).toEqual('Utilities')
            
            // Verify that the parent category id has been set on each subcategory            
            expect(data[0].subcategories[0].parentCategoryId).toEqual(data[0]._id)
            expect(data[0].subcategories[1].parentCategoryId).toEqual(data[0]._id)
            expect(data[0].subcategories[2].parentCategoryId).toEqual(data[0]._id)           
            expect(data[1].subcategories[0].parentCategoryId).toEqual(data[1]._id)
            expect(data[1].subcategories[1].parentCategoryId).toEqual(data[1]._id)
            expect(data[1].subcategories[2].parentCategoryId).toEqual(data[1]._id)
            expect(data[1].subcategories[3].parentCategoryId).toEqual(data[1]._id)
        })
        
        test('Retrieve the category select list', async () => {
            expect.hasAssertions()

            // Stub the request
            moxios.stubRequest(categoryUrl, {
                status: 200,
                response: categoryList
            })

            const data = await CategoryService.getCategorySelect()
                       
            // Verify the returned data array containing two categories with name and value properties
            expect(data.length).toEqual(2)
            expect(data[0].label).toEqual(categoryList[0].name)
            expect(data[0].value).toEqual(categoryList[0]._id)
            expect(data[1].label).toEqual(categoryList[1].name)
            expect(data[1].value).toEqual(categoryList[1]._id)            

            // Verify that the returned categories are sorted by category name
            expect(data[0].label).toEqual('Travel')
            expect(data[1].label).toEqual('Utilities')            
        })

        test('Retrieve the category info data structures', async () => {
            expect.hasAssertions()

            // Stub the request
            moxios.stubRequest(categoryUrl, {
                status: 200,
                response: categoryList
            })

            const data = await CategoryService.getCategoryInfo()

            // Verify that the expected data structures are returned
            expect(data.categories).toBeTruthy()
            expect(data.selectCategories).toBeTruthy()
            expect(data.categoryMap).toBeTruthy()
            expect(data.subcategories).toBeTruthy()
            expect(data.subcategoryMap).toBeTruthy()

            // Verify data structure lengths
            expect(data.categories.length).toEqual(2)
            expect(data.selectCategories.length).toEqual(2)
            expect(Object.keys(data.categoryMap).length).toEqual(2)
            expect(data.subcategories.length).toEqual(7)
            expect(Object.keys(data.subcategories).length).toEqual(7)
                      
            // Verify data, with categories sorted by name            
            expect(data.categories[0].name).toEqual('Travel')
            expect(data.categories[1].name).toEqual('Utilities')

            expect(data.selectCategories[0].name).toEqual('Travel')
            expect(data.selectCategories[1].name).toEqual('Utilities')

            expect(data.categoryMap['1']).toEqual(categoryList[1]) 
            expect(data.categoryMap['2']).toEqual(categoryList[0]) 

            expect(data.subcategories[0]).toEqual(categoryList[0].subcategories[0]) 
            expect(data.subcategories[1]).toEqual(categoryList[0].subcategories[1]) 
            expect(data.subcategories[2]).toEqual(categoryList[0].subcategories[2]) 
            expect(data.subcategories[3]).toEqual(categoryList[1].subcategories[0])
            expect(data.subcategories[4]).toEqual(categoryList[1].subcategories[1])
            expect(data.subcategories[5]).toEqual(categoryList[1].subcategories[2])
            expect(data.subcategories[6]).toEqual(categoryList[1].subcategories[3])  
            
            expect(data.subcategoryMap['travel-s1']).toEqual(categoryList[0].subcategories[0])
            expect(data.subcategoryMap['travel-s2']).toEqual(categoryList[0].subcategories[1])
            expect(data.subcategoryMap['travel-s3']).toEqual(categoryList[0].subcategories[2])
            expect(data.subcategoryMap['utilities-s1']).toEqual(categoryList[1].subcategories[0])
            expect(data.subcategoryMap['utilities-s2']).toEqual(categoryList[1].subcategories[1])
            expect(data.subcategoryMap['utilities-s3']).toEqual(categoryList[1].subcategories[2])
            expect(data.subcategoryMap['utilities-s4']).toEqual(categoryList[1].subcategories[3])
        })        
    })
    
    describe('Error Handling Tests', () => {       

        test('Handle error when retrieving the list of categories', (done) => {
            expect.hasAssertions()

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

            // Stub the request
            moxios.stubRequest(categoryUrl, {
                status: 500,
                response: { response: {} }
            })            
           
            CategoryService.getCategories().catch(() => {
                expect(consoleSpy).toHaveBeenCalledWith('CategoryService.getCategories error:', expect.anything())               
                consoleSpy.mockRestore()
                done()
            })            
        })

        test('Handle error when retrieving the category select list', (done) => {
            expect.hasAssertions()

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

            // Stub the request
            moxios.stubRequest(categoryUrl, {
                status: 500,
                response: { response: {} }
            })            
           
            CategoryService.getCategorySelect().catch(() => {
                expect(consoleSpy).toHaveBeenCalledWith('CategoryService.getCategories error:', expect.anything())               
                consoleSpy.mockRestore()
                done()
            })            
        })
        
        test('Handle error when retrieving the category info', (done) => {
            expect.hasAssertions()

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

            // Stub the request
            moxios.stubRequest(categoryUrl, {
                status: 500,
                response: { response: {} }
            })            
           
            CategoryService.getCategoryInfo().catch(() => {
                expect(consoleSpy).toHaveBeenCalledWith('CategoryService.getCategories error:', expect.anything())               
                consoleSpy.mockRestore()
                done()
            })            
        })
    })    
})
