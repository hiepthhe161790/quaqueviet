import React from "react";
// import { useDispatch } from "react-redux";
// import { deleteItem, drecreaseQuantity, increaseQuantity } from "../../redux/orebiSlice";
import { Box, Typography} from "@mui/material";
// import { Delete, Add, Remove } from "@mui/icons-material";
import ProductService from "../../services/api/ProductService";
import ColorIndicator from "../Cart/ColorIndicator";
import ImgDefault from '../../assets/images/default.jpg';
const ItemCard = ({ item }) => {
  // const dispatch = useDispatch();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="10px 0"
      borderBottom="1px solid #ddd"
    >
      <Box display="flex" alignItems="center" gap="10px">
        <span className="text-sm text-gray-500">{item.variant }</span>
        <img src={item.images && item.images.length > 0 ? 
          ProductService.getImage(item.images[0].filename) : 
          ImgDefault
          } alt="productImage" style={{ width: 50, height: 50, objectFit: "cover" }} />
        <Box display="flex" flexDirection="column">
          <Typography variant="subtitle1" fontWeight="bold">
            {item.name}
          </Typography>
          <Typography variant="body2">{item.variant}</Typography>
        </Box>
      </Box>

      <Box display="flex" alignItems="center">
        {/* <IconButton
          size="small"
          onClick={() => dispatch(drecreaseQuantity({ _id: item._id }))}
        >
          <Remove />
        </IconButton> */}
        <Typography variant="body1" mx={1}>
         x {item.quantity}
        </Typography>
        {/* <IconButton
          size="small"
          onClick={() => dispatch(increaseQuantity({ _id: item._id }))}
        >
          <Add />
        </IconButton> */}
      </Box>

      {/* <Typography variant="body1">
        {item.price.toLocaleString()}đ
      </Typography> */}

      <Typography variant="body1" fontWeight="bold">
        {(item.quantity * item.price).toLocaleString()}đ
      </Typography>

      {/* <IconButton
        color="error"
        onClick={() => dispatch(deleteItem(item._id))}
      >
        <Delete />
      </IconButton> */}
    </Box>
  );
};

export default ItemCard;
