import { useState, useEffect, useContext } from "react";
import {
    Button,
    Chip,
    Grid,
    makeStyles,
    Paper,
    Typography,
} from "@material-ui/core";
import axios from "axios";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
    body: {
        height: "inherit",
    },
    button: {
        width: "100%",
        height: "100%",
    },
    jobTileOuter: {
        padding: "30px",
        margin: "20px 0",
        boxSizing: "border-box",
        width: "100%",
    },
    popupDialog: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
}));

const JobTile = (props) => {
    const classes = useStyles();
    const { job } = props;
    const setPopup = useContext(SetPopupContext);

    const deadline = new Date(job.deadline).toLocaleDateString();

    return (
        <Paper className={classes.jobTileOuter} elevation={3}>
            <Grid container>
                <Grid container item xs={9} spacing={1} direction="column">
                    <Grid item>
                        <Typography variant="h5">{job.title}</Typography>
                    </Grid>
                    <Grid item>Role : {job.jobType}</Grid>
                    <Grid item>Salary : &#8377; {job.salary} per month</Grid>
                    <Grid item>
                        Duration :{" "}
                        {job.duration !== 0 ? `${job.duration} month` : `Flexible`}
                    </Grid>
                    <Grid item>Posted By : {job.recruiter.name}</Grid>
                    <Grid item>Application Deadline : {deadline}</Grid>

                    <Grid item>
                        {job.skillsets.map((skill) => (
                            <Chip label={skill} style={{ marginRight: "2px" }} />
                        ))}
                    </Grid>
                </Grid>
                <Grid item xs={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        disabled={userType() === "recruiter"}
                    >
                        Apply
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

const Home = (props) => {
    const [jobs, setJobs] = useState([]);

    const setPopup = useContext(SetPopupContext);
    useEffect(() => {
        getData();
    }, []);

    const getData = () => {

        let address = apiList.jobs;

        axios.get(address, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }).then((response) => {
            console.log(response.data);
            setJobs(
                response.data.filter((obj) => {
                    const today = new Date();
                    const deadline = new Date(obj.deadline);
                    return deadline > today;
                })
            );
        })
            .catch((err) => {
                console.log(err.response.data);
                setPopup({
                    open: true,
                    severity: "error",
                    message: "Error",
                });
            });
    };

    return (
        <>
            <Grid
                container
                item
                direction="column"
                alignItems="center"
                style={{ padding: "30px", minHeight: "93vh" }}
            >
                <Grid
                    item
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs>
                        <Typography variant="h2">Jobs</Typography>
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    xs
                    direction="column"
                    alignItems="stretch"
                    justify="center"
                >
                    {jobs.length > 0 ? (
                        jobs.map((job) => {
                            return <JobTile job={job} />;
                        })
                    ) : (
                        <Typography variant="h5" style={{ textAlign: "center" }}>
                            No jobs found
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default Home;
