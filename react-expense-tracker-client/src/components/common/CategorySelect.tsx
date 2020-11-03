import React, { useState, ChangeEvent, ReactNode } from 'react'
import {TextField, MenuItem} from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Category, SelectCategory, CategoryMap} from 'types'

const useStyles = makeStyles((theme : Theme) => createStyles({    
    categorySelect: {
        marginRight: '16px',
        backgroundColor: '#ffffff',
        borderRadius: '5px'      
    }
}))

interface Props {
    selectCategories: SelectCategory[]
    categoryMap: CategoryMap
    handleCategoryChange: (categoryIds: Category[]) => void    
}

export default React.memo(function CategorySelect({ selectCategories, categoryMap, handleCategoryChange } : Props) {
    const classes = useStyles()
   

    const [categoryIds, setCategoryIds] = useState<string[]>([])

    // Update state when a category is selected
    const handleChange : (((event: ChangeEvent<{ name?: string | undefined; value: unknown; }>, child: ReactNode) => void)) = (event) => {
        const categoryIds:any = event.target.value               
        setCategoryIds(categoryIds)
        handleCategoryChange(categoryIds)
    }

    const onBlur: any = handleChange

    // Override how the selected categories are displayed 
    const renderSelectedCategories = (values: any) => {
        const otherCount = values.length > 1 ? '(+ ' + (values.length - 1) + ')' : ''
        return (
            <div>{categoryMap[values[0]]} {otherCount}</div>
        )
    }

    return (
        <TextField select id="categoryIds" name="categoryIds" label="Category" value={categoryIds} 
            className={classes.categorySelect} variant="outlined" margin="dense"              
            SelectProps={{
                multiple: true, value: categoryIds, onChange: handleChange, onBlur: onBlur,
                renderValue: renderSelectedCategories,
                MenuProps: { 
                    getContentAnchorEl: () => null!,                   
                    anchorOrigin: { vertical:'top', horizontal: 'center'} 
                }
            }}>                                 
            {
                selectCategories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                        {category.label}
                    </MenuItem>
                ))
            }
        </TextField >
    )
})