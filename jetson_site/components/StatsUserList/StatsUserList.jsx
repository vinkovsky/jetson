import React, { useState } from 'react'
import { Avatar, Dialog, LinearProgress, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Typography } from "@material-ui/core"
import { Restore } from '@material-ui/icons'
import useSWR, { mutate } from 'swr'
import { useRouter } from 'next/router'

const fetcher = (url) =>
    fetch(url)
        .then((res) => res.json())
        .then((json) => json.data)

const contentType = 'application/json'

const StatsUserList = () => {
    const { data: stats, error } = useSWR('/api/stats', fetcher, { refreshInterval: 1000 })

    const [open, setOpen] = useState({ open: false, src: '' })
    const router = useRouter()

    if (!stats) return <LinearProgress color="secondary" />

    const clearHistoryHandler = async () => {
        if (stats.length === 0) return
        await fetch('/api/stats', {
            method: 'DELETE',
            headers: {
                Accept: contentType,
                'Content-Type': contentType,
            },
            body: JSON.stringify({
                stats: null
            }),
        })
        mutate('/api/stats')
        router.push('/dashboard')
    }

    return (
        <>
            <List>
                <ListItem button onClick={clearHistoryHandler}>
                    <ListItemIcon>
                        <Restore />
                    </ListItemIcon>
                    <ListItemText primary={'Clear history'} />
                </ListItem>
                {stats.length > 0 ? stats.map((stat, i) => {
                    return (
                        <ListItem button key={i}>
                            <ListItemAvatar key={stat.images._id} onClick={(e) => e.target.src && setOpen({ open: true, src: e.target.src })}>
                                <Avatar
                                    src={stat.images.url}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={stat.name}
                            />
                            <ListItemText
                                primary={new Date(stat.date).toLocaleString()}
                            />
                        </ListItem>
                    )
                }) : <Typography variant="caption" display="block" align="center">No history found</Typography>}
            </List >
            <Dialog open={open.open} onClose={() => setOpen((state) => ({ ...state, open: false }))}>
                <img src={open.src} />
            </Dialog>
        </>
    )
}

export default StatsUserList