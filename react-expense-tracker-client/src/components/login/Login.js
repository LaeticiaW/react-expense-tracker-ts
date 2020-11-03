import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch } from "react-redux"
import * as Actions from '../../store/actions/actions'
import { Button } from '@material-ui/core'
import PageHeader from '../common/PageHeader'
import UserService from '../../services/user'
import FormSelect from '../common/form/FormSelect'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    form: {
        margin: 'auto',
        paddingTop: '100px',
        width: '200px'
    },
    loginButton: {
        marginTop: '24px'
    }
}))

export default function Login(props) {
    const classes = useStyles()    
    const dispatch = useDispatch()

    const [userId, setUserId] = useState('')
    const [users, setUsers] = useState([])
    const [errors, setErrors] = useState({})

    // Retrieve the list of users
    const getUsers = useCallback(() => {
        UserService.getUsers().then(users => {
            setUsers(users)
        })
    }, [])

    // Retrieve list of users on mount
    useEffect(() => {
        getUsers()
    }, [getUsers])

    // Validate a form field
    const validateField = (name, value) => {
        if (value === '') {
            setErrors({ ...errors, [name]: 'Value is required' })
            return false
        }
        return true
    }

    // Update state when form values change
    const handleChange = (event) => {
        setUserId(event.target.value)
        validateField(event.target.name, event.target.value)
    }

    // Login the user
    const handleLogin = () => {
        if (validateField('userId', userId)) {           
            dispatch(Actions.loginAsync(userId))
            props.history.push('/dashboard')
        }
    }

    return (
        <div>
            <PageHeader pageTitle="Login" />

            <div>
                <form className={classes.form} noValidate autoComplete="off">
                    <FormSelect id="userId" value={userId} label="User ID"
                        onChange={handleChange} selectList={users} valueProp="id" labelProp="id"
                        error={Boolean(errors.userId)} helperText={errors.userId} />
                    <Button className={classes.loginButton} size="small" variant="contained"
                        onClick={handleLogin} color="primary">
                        Login
                    </Button>
                </form>
            </div>

        </div>
    )
}