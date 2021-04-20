import React, { useState } from 'react'
import { Avatar, Dialog, IconButton, InputBase, ListItemAvatar, ListItemSecondaryAction, ListItemText } from "@material-ui/core"
import { Add } from "@material-ui/icons"
import { useRouter } from 'next/router'
import { mutate } from 'swr'

const contentType = 'application/json'

const UndefinedUserItem = ({ group }) => {
    const [name, setName] = useState('')
    const [open, setOpen] = useState({ open: false, src: '' })
    const router = useRouter()
    const handleInputChange = (e) => {
        setName(e.target.value);
    }

    const handleCreateUser = async () => {
        await fetch('/api/users', {
            method: 'POST',
            headers: {
                Accept: contentType,
                'Content-Type': contentType,
            },
            body: JSON.stringify({
                name: name || `User - ${Math.floor(Math.random() * 100000)}`,
                images: [group[0]._id, group[1]._id]
            }),
        })

        mutate('/api/images')
        router.push('/dashboard')
        setName('')
    }

    return (
        <>
            {group.sort((x) => x.croped ? 0 : x ? -1 : 1).map((image) => (
                <ListItemAvatar key={image._id} onClick={(e) => e.target.src && setOpen({ open: true, src: e.target.src })}>
                    <Avatar
                        src={image.url}
                    />
                </ListItemAvatar>
            ))}
            <InputBase
                style={{ width: 400 }}
                placeholder="Undefined User"
                value={name}
                onChange={handleInputChange}
            />
            <ListItemText
                primary={new Date(group[0].date).toLocaleString()}
            />
            <ListItemSecondaryAction>
                <IconButton onClick={handleCreateUser}>
                    <Add />
                </IconButton>
            </ListItemSecondaryAction>
            <Dialog open={open.open} onClose={() => setOpen((state) => ({ ...state, open: false }))}>
                <img src={open.src} />
            </Dialog>
        </>
    )
}

export default UndefinedUserItem