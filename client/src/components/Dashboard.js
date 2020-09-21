import React, { useEffect, useState } from 'react';
import {
    Card, CardActionArea, CardMedia, CardContent, CardActions,
    Grid, Typography, Button
} from '@material-ui/core';

import axios from 'axios'

const Dashboard = () => {
    const [folders, setFolders] = useState([])

    useEffect(() => {
        axios.get('http://localhost:3005/api/drive/folders', {
            headers: {
                Authorization: 'Bearer ' + localStorage.jwtToken
            }
        }).then(({ data }) => {
            console.log(data)
            setFolders(data)
        })
    }, [])

    return (
        <React.Fragment>
            <Typography> TOKEN: {localStorage.jwtToken} </Typography>
            <Grid container style={{ marginTop: '20px' }}>
                {folders.map((folder, index) => (
                    <Grid item xs={6} md={4} lg={3} key={"folder-card-" + index}>
                        <Card style={{ margin: 'auto', width: '80%', marginBottom: '35px' }} elevation={15}>
                            <CardActionArea
                                href={`/folders/${folder.id}`}
                            >
                                <CardMedia
                                    image={'https://pernoraanimalistranidalmondo.files.wordpress.com/2016/01/lemure_1.jpg'}
                                    style={{ height: '150px' }}
                                />

                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {folder.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button size="small" color="primary">
                                    Prova
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </React.Fragment>
    )
};

export default Dashboard;
