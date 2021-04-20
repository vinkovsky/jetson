import React from 'react'
import { LinearProgress, List, ListItem, Typography } from "@material-ui/core"
import useSWR from 'swr'
import UndefinedUserItem from '../UndefinedUserItem'

const fetcher = (url) =>
    fetch(url)
        .then((res) => res.json())
        .then((json) => json.data)

const UndefinedUserList = () => {
    const { data: images, error } = useSWR('/api/images', fetcher, { refreshInterval: 1000 })

    if (!images) return <LinearProgress color="secondary" />

    const groups = images.reduce((group, key, index) => {
        return (index % 2 == 0 ? group.push([key])
            : group[group.length - 1].push(key)) && group
    }, [])

    return (
        <List>
            {groups.length > 0 ?
                groups.map((group, i) => (
                    <ListItem button key={i}>
                        <UndefinedUserItem group={group} />
                    </ListItem>
                ))
                : <Typography variant="caption" display="block" align="center">No undefined users found</Typography>
            }
        </List>
    )
}

export default UndefinedUserList