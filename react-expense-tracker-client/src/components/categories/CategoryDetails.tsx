import React, { useState, useContext } from 'react'
import { Card, CardContent, Toolbar, Fab } from '@material-ui/core'
import { Edit as EditIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import UpdateCategoryDialog from './UpdateCategoryDialog'
import { CategoryContext } from './CategoryContext'
import { Category } from 'types'

const useStyles = makeStyles(theme => ({
    card: {
        height: '100%',
        overflow: 'auto'
    },
    contentRoot: {
        padding: '0px'
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#d8ebf7',
        borderRadius: '5px',
        marginBottom: '16px'
    },
    contentContainer: {
        padding: '24px'
    },
    row: {
        display: 'flex',
        marginBottom: '16px'
    },
    label: {
        width: '200px',
        fontWeight: 'bold'
    }
}))

interface Props {
    category: Category    
}

export default React.memo(function CategoryDetails({ category } : Props) {
    const classes = useStyles()
    const { getCategories } = useContext(CategoryContext)
    const [openDialog, setOpenDialog] = useState(false)

    const handleShowDialog = () => {
        setOpenDialog(true)
    }

    const handleCloseDialog = (isUpdated: boolean) => {
        setOpenDialog(false)
        if (isUpdated) {
            getCategories()
        }
    }

    return (
        <>
            <Card className={classes.card} elevation={2}>
                <CardContent classes={{ root: classes.contentRoot }}>
                    <Toolbar className={classes.toolbar}>
                        <h3 className="detailsTitle">Category Details</h3>                       
                        <Fab size="small" color="primary" onClick={handleShowDialog} title="Menu">
                            <EditIcon />
                        </Fab>
                    </Toolbar>

                    <div className={classes.contentContainer}>
                        <div className={classes.row}>
                            <label className={classes.label} htmlFor="categoryName">Category:</label>
                            <div id="categoryName">{category.name}</div>
                        </div>

                        <div className={classes.row}>
                            <label className={classes.label} htmlFor="subcategories">Subcategories:</label>
                            <div id="subcategories">
                                {category.subcategories.map(subcat => (
                                    <div key={subcat.id}>{subcat.name}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                </CardContent>
            </Card>
            <UpdateCategoryDialog open={openDialog} category={category} onClose={handleCloseDialog} />
        </>
    )
})

