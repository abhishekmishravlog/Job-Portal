import { useState, useEffect, useContext } from "react";
import {
    Button,
    Chip,
    Grid,
    makeStyles,
    Paper,
    Typography,
    Avatar,
} from "@material-ui/core";
import axios from "axios";

import { SetPopupContext } from "../../App";

import apiList, { server } from "../../lib/apiList";

const useStyles = makeStyles((theme) => ({
    body: {
        height: "inherit",
    },
    statusBlock: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textTransform: "uppercase",
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
    avatar: {
        width: theme.spacing(17),
        height: theme.spacing(17),
    },
}));

const ApplicationTile = (props) => {
    const classes = useStyles();
    const { application, getData } = props;
    const setPopup = useContext(SetPopupContext);

    const appliedOn = new Date(application.dateOfApplication);

    const colorSet = {
        applied: "#3454D1",
        shortlisted: "#DC851F",
        accepted: "#09BC8A",
        rejected: "#D1345B",
        deleted: "#B49A67",
        cancelled: "#FF8484",
        finished: "#4EA5D9",
    };

    const getResume = () => {
        if (
            application.jobApplicant.resume &&
            application.jobApplicant.resume !== ""
        ) {
            const address = `${server}${application.jobApplicant.resume}`;
            console.log(address);
            axios(address, {
                method: "GET",
                responseType: "blob",
            }).then((response) => {
                const file = new Blob([response.data], { type: "application/pdf" });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            }).catch((error) => {
                console.log(error);
                setPopup({
                    open: true,
                    severity: "error",
                    message: "Error",
                });
            });
        } else {
            setPopup({
                open: true,
                severity: "error",
                message: "No resume found",
            });
        }
    };

    return (
        <Paper className={classes.jobTileOuter} elevation={3}>
            <Grid container>
                <Grid
                    item
                    xs={2}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Avatar
                        src={`${server}${application.jobApplicant.profile}`}
                        className={classes.avatar}
                    />
                </Grid>
                <Grid container item xs={7} spacing={1} direction="column">
                    <Grid item>
                        <Typography variant="h5">
                            {application.jobApplicant.name}
                        </Typography>
                    </Grid>
                    <Grid item>Job Title: {application.job.title}</Grid>
                    <Grid item>Role: {application.job.jobType}</Grid>
                    <Grid item>Applied On: {appliedOn.toLocaleDateString()}</Grid>
                    <Grid item>
                        SOP: {application.sop !== "" ? application.sop : "Not Submitted"}
                    </Grid>
                    <Grid item>
                        {application.jobApplicant.skills.map((skill) => (
                            <Chip label={skill} style={{ marginRight: "2px" }} />
                        ))}
                    </Grid>
                </Grid>
                <Grid item container direction="column" xs={3}>
                    <Grid item>
                        <Button
                            variant="contained"
                            className={classes.statusBlock}
                            color="primary"
                            onClick={() => getResume()}
                        >
                            Download Resume
                        </Button>
                    </Grid>
                    <Grid item container xs>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.statusBlock}
                            style={{
                                background: "#09BC8A",
                            }}
                        >
                            End Job
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

const AcceptedApplicants = (props) => {
    const setPopup = useContext(SetPopupContext);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        let searchParams = [];
        searchParams = [...searchParams, `status=accepted`];
        searchParams = [...searchParams];
        const queryString = searchParams.join("&");
        console.log(queryString);
        let address = `${apiList.applicants}`;
        if (queryString !== "") {
            address = `${address}?${queryString}`;
        }

        console.log(address);

        axios.get(address, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }).then((response) => {
            console.log(response.data);
            setApplications(response.data);
        }).catch((err) => {
            console.log(err.response);
            // console.log(err.response.data);
            setApplications([]);
            setPopup({
                open: true,
                severity: "error",
                message: err.response.data.message,
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
                <Grid item>
                    <Typography variant="h2">Employees</Typography>
                </Grid>
                <Grid
                    container
                    item
                    xs
                    direction="column"
                    style={{ width: "100%" }}
                    alignItems="stretch"
                    justify="center"
                >
                    {applications.length > 0 ? (
                        applications.map((obj) => (
                            <Grid item>
                                {/* {console.log(obj)} */}
                                <ApplicationTile application={obj} getData={getData} />
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="h5" style={{ textAlign: "center" }}>
                            No Applications Found
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default AcceptedApplicants;
