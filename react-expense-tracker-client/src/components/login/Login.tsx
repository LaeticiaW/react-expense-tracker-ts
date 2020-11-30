import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch } from "react-redux"
import * as Actions from '../../store/actions/actions'
import { Button } from '@material-ui/core'
import PageHeader from '../common/PageHeader'
import UserService from '../../services/user'
import FormSelect from '../common/form/FormSelect'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { History } from 'history'
import { User } from 'types'

const useStyles = makeStyles((theme : Theme) => createStyles({
    form: {
        margin: 'auto',
        paddingTop: '100px',
        width: '200px'
    },
    loginButton: {
        marginTop: '24px'
    }
}))

interface Props {
    history: History
}

export default function Login({ history } : Props) {
    const classes = useStyles()    
    const dispatch = useDispatch()

    const [userId, setUserId] = useState('')
    const [users, setUsers] = useState<User[]>([])
    const [errors, setErrors] = useState<Record<string, string>>({})

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
    const validateField = (name : string, value : string) => {
        if (value === '') {
            setErrors({ ...errors, [name]: 'Value is required' })
            return false
        }
        return true
    }

    // Update state when form values change
    const handleChange = (value: string, name: string) => {
        setUserId(value)
        validateField(name, value)
    }

    // Login the user
    const handleLogin = () => {
        if (validateField('userId', userId)) {           
            dispatch(Actions.loginAsync(userId))
            history.push('/dashboard')
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