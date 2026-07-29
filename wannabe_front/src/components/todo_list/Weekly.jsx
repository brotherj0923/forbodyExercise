import { Button, Stack, TextField, Typography } from '@mui/material';
import { BackgroundBox, ForegroundBox } from '../styled_comp/StyledDiv';
import './css/weeklyPicker.css';

const Weekly = ({ setDate, setDay, date }) => {
    const toLocalDate = (value) => new Date(`${value}T00:00:00`);
    const toDateString = (value) => {
        const offset = value.getTimezoneOffset() * 60000;
        return new Date(value.getTime() - offset).toISOString().slice(0, 10);
    };
    const getWeekDates = () => {
        const selected = toLocalDate(date);
        const start = new Date(selected);
        start.setDate(selected.getDate() - selected.getDay());
        return Array.from({ length: 7 }, (_, index) => {
            const day = new Date(start);
            day.setDate(start.getDate() + index);
            return day;
        });
    };
    const onselectDate = (value) => {
        const selectedDate = value instanceof Date ? value : toLocalDate(value);
        setDate(toDateString(selectedDate));
        setDay(selectedDate.getDay());
    };
    const weekDates = getWeekDates();
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <BackgroundBox
            style={{
                width: '90%',
                justifyContent: 'center',
            }}
        >
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {date.slice(5, 7)}/{date.slice(8, 10)}
            </Typography>
            <ForegroundBox
                style={{
                    width: '100%',
                    marginTop: '10px',
                }}
            >
                <TextField
                    type="date"
                    value={date}
                    onChange={(event) => onselectDate(event.target.value)}
                    fullWidth
                    size="small"
                    inputProps={{ 'aria-label': 'select date' }}
                />
                <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ mt: 2 }}>
                    {weekDates.map((day) => {
                        const value = toDateString(day);
                        const selected = value === date;
                        return (
                            <Button
                                key={value}
                                variant={selected ? 'contained' : 'outlined'}
                                color="secondary"
                                onClick={() => onselectDate(day)}
                                sx={{ minWidth: 0, flex: 1, px: 0 }}
                            >
                                {dayLabels[day.getDay()]}
                                <br />
                                {day.getDate()}
                            </Button>
                        );
                    })}
                </Stack>
            </ForegroundBox>
        </BackgroundBox>
    );
};

export default Weekly;
