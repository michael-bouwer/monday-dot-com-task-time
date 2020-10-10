import React from 'react';
import { useQuery } from "@apollo/client";
import queries from "../../api";
import "./styles.scss";
import { _currentUser, _currentBoard } from "../../globals/variables";
import moment from 'moment';

function TimeSheetsToday() {

    const [timeSheets, setTimeSheets] = useState(null);

    const { loading, error, data } = useQuery(queries.SUBSCRIBERS, {
        variables: { ids: _currentBoard() },
    });

    if (loading && !timeSheets) return null;
    if (error) return <p>Error :(</p>;

    useEffect(() => {
        // If timeSheets have not been initialiazed and the API has returned a list of users, get all users'
        // timeSheets for today
        if (!timeSheets && data) {
            getTimeSheetsToday();
        }
    }, []);

    const getTimeSheetsToday = async () => {
        var arrayOfUsersTimeSheets = [];
        data.boards[0].subscribers.map((sub) => {
            await monday.storage.instance
                .getItem(moment().format('yyyy-MM-dd') + '_' + sub.id) // Fetch the key combination of today's date and user. Eg: 2020-10-19_8741478
                .then((res) => {
                    const { value, version } = res.data;
                    if (value && value.length > 0) {
                        arrayOfUsersTimeSheets.push(JSON.parse(value)); // Add user's timesheets for today to the list object
                    }
                });
        });
        setTimeSheets(arrayOfUsersTimeSheets);
    };

    return (
        <div>
            <div className="header">
                {timeSheets.map((user) => {
                    <div key={user.id}>
                        {user.name}
                    </div>
                    user.map((timeSheet) => {
                        <p key={timeSheet.id}>
                            {timeSheet.title}
                        </p>
                    })
                })}
            </div>
        </div>
    );
}

export default TimeSheetsToday;