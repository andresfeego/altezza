// MenuOpcionesEvento.js
import { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { BsThreeDotsVertical } from 'react-icons/bs';

export default function MenuOpcionesEvento({ onEditar }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleOpen(e);
        }}
      >
        <BsThreeDotsVertical />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        keepMounted
        PopperProps={{ disablePortal: true }}
      >
        <MenuItem
          onClick={() => {
            onEditar();
            handleClose();
          }}
        >
          Editar
        </MenuItem>
      </Menu>
    </>
  );
}
