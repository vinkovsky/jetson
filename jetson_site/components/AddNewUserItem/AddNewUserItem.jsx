import React, { useState } from 'react'
import { Dialog, DialogContent, ListItem, ListItemIcon, ListItemText } from "@material-ui/core"
import { Add } from "@material-ui/icons"

const AddNewUserItem = () => {

    const [open, setOpen] = useState(false)

    return (
        <>
            <ListItem button alignItems="center" onClick={() => setOpen(true)}>
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                <ListItemText primary={'Add new user'} />
            </ListItem>
            <Dialog open={open} fullWidth={true}
                maxWidth={'sm'} onClose={() => setOpen(false)} >

                <DialogContent>
                    {'Create user here'}
                </DialogContent>

            </Dialog>
        </>
    )
}

export default AddNewUserItem