import React, { useEffect, useState } from 'react';
import {
    Card, CardActionArea, CardMedia, CardContent, CardActions,
    Grid, Typography, Button, Paper, GridListTile, GridList, Box, GridListTileBar
} from '@material-ui/core';

import axios from 'axios'

const FolderPage = (props) => {
    const [images, setImages] = useState([])
    const { folderId } = props.match.params

    useEffect(() => {
        axios.get(`http://localhost:3005/api/drive/folders/${folderId}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.jwtToken
            }
        }).then(({ data }) => {
            console.log(data)
            setImages(data)
        })
    }, [])

    return (
        <React.Fragment>

            <Box
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    overflow: 'hidden'
                }}
            >
                <GridList cellHeight={160} cols={3}
                    style={{
                        width: '500px'
                    }}
                >
                    {images.map((image, index) => (
                        <GridListTile
                            key={`image-${index}`}
                            cols={image.cols || 1}
                        >
                            <GridListTileBar
                                title={image.name}
                                subtitle="Bella"
                                // subtitle={<span>by: {tile.author}</span>}
                                // actionIcon={
                                //     <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
                                //         <InfoIcon />
                                //     </IconButton>
                                // }
                            />
                            <img src={image.thumbnailLink} alt={`image-${index}`} />
                        </GridListTile>
                    ))}
                </GridList>
            </Box>

            {/* <Typography> Folder Page </Typography>
            <div style={{
                position: 'fixed',
                bottom: '0',
                left: '0',
                height: '100px',
                width: '100%',
                backgroundColor: 'red'
            }}>

            </div>
            <Grid container style={{ marginTop: '20px', padding: '20px' }}>
                {images.map((image, index) => (
                    <Grid item xs={6} md={4} lg={3} key={"image-" + index}>
                        <Paper
                            elevation={13}
                            style={{
                                width: '80%',
                                height: '200px',
                                textAlign: 'center',
                                marginBottom: '20px'
                            }}
                        >
                            <span style={{ verticalAlign: 'middle', display: 'inline-block', height: '100%' }}> </span>

                            <img
                                style={{
                                    height: '70%',
                                    maxWidth: '90%',
                                    verticalAlign: 'middle'
                                }}
                                src={image.thumbnailLink}
                            />
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <div style={{ height: '100px'}}>

            </div> */}
        </React.Fragment>
    )
};

export default FolderPage;
