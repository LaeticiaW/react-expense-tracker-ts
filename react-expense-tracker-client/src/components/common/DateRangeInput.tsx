import React, { useState } from 'react'
import { DatePicker } from '@material-ui/pickers'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import dayjs from 'dayjs'

const useStyles = makeStyles((theme : Theme) => createStyles({
    dateRangeContainer: {
        display: 'inline-block',
        width: '234px',
        whiteSpace: 'nowrap'
    },
    datePicker: {
        marginTop: '8px',
        marginRight: '16px',
        width: '100px',
        minWidth: '100px',
        backgroundColor: '#ffffff',
        borderRadius: '5px',

        '& input': {
            fontSize: '0.875rem !important'
        }
    }
}))

interface Props {
    startDate: string
    endDate: string
    handleDateChange: (startDt: string, startDtMs: number, endDt: string, endDtMs: number) => void
}

export default React.memo(function DateRangeInput({ startDate, endDate, handleDateChange } : Props) {
    const classes = useStyles()

    const [startDt, setStartDt] = useState(startDate || dayjs().startOf('year').format('YYYY-MM-DD'))
    const [endDt, setEndDt] = useState(endDate || dayjs().endOf('day').format('YYYY-MM-DD'))
    const [startDtMs, setStartDtMs] = useState(dayjs(startDt).valueOf())
    const [endDtMs, setEndDtMs] = useState(dayjs(endDt).valueOf())

    const handleChange = (startDateMs : number, endDateMs : number) => {
        const start = dayjs(startDateMs).format('YYYY-MM-DD')
        const end = dayjs(endDateMs).format('YYYY-MM-DD')

        setStartDt(start)
        setStartDtMs(startDateMs)
        setEndDt(end)
        setEndDtMs(endDateMs)

        handleDateChange(start, startDateMs, end, endDateMs)
    }

    return (
        <div className={classes.dateRangeContainer}>
            <DatePicker value={startDt} onChange={(date : any) => handleChange(date, endDtMs)}
                className={classes.datePicker}
                label="Start Date" format="YYYY-MM-DD"
                inputVariant="outlined"
                autoOk={true} allowKeyboardControl={true}
                InputProps={{ margin: 'dense' }}
            />

            <DatePicker value={endDt} onChange={(date : any) => handleChange(startDtMs, date)}
                className={classes.datePicker}
                label="End Date" format="YYYY-MM-DD"
                inputVariant="outlined"
                autoOk={true} allowKeyboardControl={true}
                InputProps={{ margin: 'dense' }}
            />
        </div>
    )
}, (prevProps, nextProps) => {
    return (prevProps.startDate === nextProps.startDate && prevProps.endDate === nextProps.endDate)
})
