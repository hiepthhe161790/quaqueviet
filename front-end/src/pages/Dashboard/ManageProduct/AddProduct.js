import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import CategoryService from '../../../services/api/CategoryService';
import BrandService from '../../../services/api/BrandService';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ProductService from '../../../services/api/ProductService';
import Notification from './Notification';
import FormHelperText from '@mui/material/FormHelperText';
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function AddProduct() {
    // các state nhỏ
    const [openAddProductDialog, setOpenAddProductDialog] = React.useState(false);
    const [openAddCategoryDialog, setOpenAddCategoryDialog] = React.useState(false);
    const [openAddBrandDialog, setOpenAddBrandDialog] = React.useState(false);
    const [keySpecs, setKeySpecs] = React.useState("");
    const [valueSpecs, setValueSpecs] = React.useState("");
    const [colorInstock, setColorInstock] = React.useState("");
    const [quantityInstock, setQuantityInstock] = React.useState(0);
    const [newBrand, setNewBrand] = React.useState({});
    const [newCategory, setNewCategory] = React.useState({});
    const [brands, setBrands] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [errors, setErrors] = React.useState({});
    // Các state form data
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [brand, setBrand] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [specs, setSpecs] = React.useState([]);
    const [instock, setInstock] = React.useState([]);
    const [price, setPrice] = React.useState(0);
    const [cost, setCost] = React.useState(0);
    const [isAvailable, setIsAvaiable] = React.useState(true);
    const [images, setImages] = React.useState([]);

    // Xử lý notification
    const [showNotification, setShowNotification] = React.useState(false);
    const [contentNotification, setContentNotification] = React.useState("");
    const [severity, setSeriverity] = React.useState("info");


    const [expiryDate, setExpiryDate] = React.useState('');
const [importDate, setImportDate] = React.useState('');
    const handleShowNotification = (isShowNotification) => {
        setShowNotification(isShowNotification);
    }
    // Xong phần xử lý notification

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const handleResetForm = () => {
        setKeySpecs("");
        setValueSpecs("");
        setColorInstock("");
        setQuantityInstock(0);

        setName("");
        setDescription("");
        setBrand("");
        setCategory("");
        setSpecs([]);
        setInstock([]);
        setPrice(0);
        setCost(0);
        setIsAvaiable(true);
        setImages([]);
           setExpiryDate('');
    setImportDate('');
    }
    const validateForm = () => {
        let newErrors = {};

        if (!name.trim()) newErrors.name = "Name food is required!";
        // // if (!description.trim()) newErrors.description = "Mô tả không được để trống!";
        if (!brand) newErrors.brand = "Please select a restaurant!";
        if (!category) newErrors.category = "Please select a category!";
        // if (!price || price  <= 0) newErrors.price = "Giá phải lớn hơn 0!";
        // if (!cost || cost <= 0) newErrors.cost = "Chi phí không hợp lệ!";
        // if (instock.length === 0) newErrors.instock = "Vui lòng thêm màu sắc & số lượng!";
        // if (specs.length === 0) newErrors.specs = "Vui lòng thêm ít nhất một thông số!";
        if (keySpecs.trim() || valueSpecs.trim()) {
            newErrors.specs = "Please click the '+' sign to add specifications or delete data!";
        }
        if (colorInstock.trim()) {
            newErrors.instock = "Please click the '+' sign to add stock or delete data!";
        }
        setErrors(newErrors);
        return Object.keys(newErrors)?.length === 0; // Trả về true nếu không có lỗi
    };
    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            const result = await ProductService.addProduct(
            name, description, brand, category, price, cost, isAvailable, specs, instock, images, expiryDate, importDate
        );
            if (result.data?.success === true) {
                setShowNotification(true);
                setContentNotification("Add product successfully!");
                setSeriverity("success");
                handleResetForm();
                setTimeout(() => {
                window.location.reload();
            }, 1000);
            } else {
                setShowNotification(true);
                setContentNotification(result.data.message);
                setSeriverity("error");
            }
        } catch (error) {
            setShowNotification(true);
            setContentNotification("An error occurred while adding the product. Please try again.");
            setSeriverity("error");
        }
    };


    React.useEffect(() => {
        (async () => {
            setCategories(await CategoryService.getAllCategories());
        })();
    }, [])

    React.useEffect(() => {
        (async () => {
            setBrands(await BrandService.getAllBrands());
        })();
    }, [])

    const handleCreateCategory = async () => {
        await CategoryService.createCategory(newCategory);
        setCategories(await CategoryService.getAllCategories());
        setOpenAddCategoryDialog(false);
    }

    const handleCreateBrand = async () => {
        await BrandService.createBrand(newBrand);
        setBrands(await BrandService.getAllBrands());
        setOpenAddBrandDialog(false);
    }

    const handleAddSpecs = () => {
        if (keySpecs.trim() !== "" && valueSpecs.trim() !== "") {
            setSpecs(prev => {
                return [
                    ...prev,
                    {
                        key: keySpecs,
                        value: valueSpecs
                    }
                ];
            });
            setKeySpecs("");
            setValueSpecs("");
        }
    };

    const handleAddInstock = () => {
        if (colorInstock.trim() !== "" && quantityInstock.trim() !== "") {
            setInstock(prev => {
                return [
                    ...prev,
                    {
                        variant: colorInstock, // gửi đúng tên biến thể cho backend
                        quantity: quantityInstock,
                        price: price
                    }
                ];
            });
            setColorInstock("");
            setQuantityInstock(0);
            setPrice(0);
        }
    };

    const handleDeleteSpecs = (specsItem) => {
        const newData = specs.filter(item => {
            return item !== specsItem
        })
        setSpecs(newData)
    };

    const handleDeleteInstock = (instockItem) => {
        const newData = instock.filter(item => {
            return item !== instockItem
        })
        setInstock(newData)
    };

    const handleClickOpenAddBrandDialog = () => {
        setOpenAddBrandDialog(true);
    };

    const handleCloseAddBrandDialog = () => {
        setOpenAddBrandDialog(false);
    };

    const handleClickOpenAddCategoryDialog = () => {
        setOpenAddCategoryDialog(true);
    };

    const handleCloseAddCategoryDialog = () => {
        setOpenAddCategoryDialog(false);
    };

    const handleClickOpenAddProductDialog = () => {
        setOpenAddProductDialog(true);
    };
    const handleCloseAddProductDialog = () => {
        setOpenAddProductDialog(false);
    };
    const theme = useTheme();

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    return (
        <>
            <Tooltip title="Thêm sản phẩm mới">
                <Zoom
                    key='primary'
                    in={true}
                    timeout={transitionDuration}
                    style={{
                        transitionDelay: `${transitionDuration.exit}ms`,
                    }}
                    unmountOnExit
                >

                    <Fab aria-label='Add' color='primary' >
                        <React.Fragment>
                            <AddIcon onClick={handleClickOpenAddProductDialog}></AddIcon>
                            <Dialog
                                open={openAddProductDialog}
                                onClose={handleCloseAddProductDialog}
                                maxWidth="md"
                            >
                                <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                                <DialogContent>
                                    <Notification handleShowNotification={handleShowNotification} showNotification={showNotification} contentNotification={contentNotification} severity={severity} ></Notification>
                                    <DialogContentText>
                                        Để thêm món ăn mới vào nhà hàng, vui lòng điền thông tin bên dưới và gửi yêu cầu.
                                    </DialogContentText>
                                    <Grid sx={{ mt: 3 }} container spacing={2}>
                                        <Grid item xs={3}>
                                            <Button
                                                component="label"
                                                role={undefined}
                                                variant="contained"
                                                tabIndex={-1}
                                                startIcon={<CloudUploadIcon />}
                                            >
                                                Tải lên hình ảnh
                                                <VisuallyHiddenInput type="file" accept="image/png, image/jpeg" multiple onChange={handleImageChange} />
                                            </Button>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Typography variant="caption" gutterBottom>
                                                {images.length} tập tin đã tải lên
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth id="standard-basic"
                                                label="Tên sản phẩm" variant="standard"
                                                value={name} onChange={e => setName(e.target.value)}
                                                error={!!errors.name}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                id="standard-select-currency"
                                                select
                                                label="Vùng miền"
                                                helperText="Chọn vùng miền của bạn"
                                                variant="standard"
                                                fullWidth
                                                value={brand}
                                                onChange={(e) => setBrand(e.target.value)}
                                            >
                                                {brands.map((brand) => (
                                                    <MenuItem key={brand?._id} value={brand?._id}>
                                                        {brand?.name}
                                                    </MenuItem>
                                                ))}
                                                <MenuItem sx={{ diplay: 'flex', justifyContent: 'center' }} onClick={handleClickOpenAddBrandDialog}>
                                                    <AddIcon color="primary" >
                                                    </AddIcon>
                                                </MenuItem>
                                            </TextField>
                                            <Dialog
                                                open={openAddBrandDialog}
                                                onClose={handleCloseAddBrandDialog}
                                            >
                                                <DialogTitle>Thêm danh mục mới</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText>
                                                        Vui lòng nhập tất cả thông tin sau để thêm thương hiệu mới. Lưu ý rằng khi đã thêm thương hiệu mới, bạn không thể xóa nó.
                                                    </DialogContentText>
                                                    <TextField
                                                        autoFocus

                                                        margin="dense"
                                                        label="Vùng miền"
                                                        type="text"
                                                        fullWidth
                                                        variant="standard"
                                                        onChange={(e) => setNewBrand(prev => ({
                                                            ...prev,
                                                            name: e.target.value
                                                        }))}
                                                    />
                                                    <TextField

                                                        sx={{ mt: 3 }}
                                                        id="outlined-multiline-static"
                                                        label="Mô tả"
                                                        multiline
                                                        rows={4}
                                                        fullWidth
                                                        onChange={(e) => setNewBrand(prev => ({
                                                            ...prev,
                                                            description: e.target.value
                                                        }))}
                                                    />
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handleCloseAddBrandDialog}>Cancel</Button>
                                                    <Button onClick={handleCreateBrand}>Add brand</Button>
                                                </DialogActions>
                                            </Dialog>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                id="standard-select-currency"
                                                select
                                                label="Danh mục"
                                                helperText="Chọn danh mục của bạn"
                                                variant="standard"
                                                fullWidth
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                            >
                                                {categories.length > 0 && categories.map((cate) => (
                                                    <MenuItem key={cate?._id} value={cate?._id}>
                                                        {cate?.name}
                                                    </MenuItem>
                                                ))}
                                                <MenuItem sx={{ diplay: 'flex', justifyContent: 'center' }} onClick={handleClickOpenAddCategoryDialog} >
                                                    <AddIcon color="primary" >
                                                    </AddIcon>
                                                </MenuItem>
                                            </TextField>
                                            <Dialog
                                                open={openAddCategoryDialog}
                                                onClose={handleCloseAddCategoryDialog}
                                            >
                                                <DialogTitle>Thêm danh mục mới</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText>
                                                        Vui lòng nhập tất cả thông tin sau để thêm danh mục mới. Lưu ý rằng khi danh mục mới được thêm vào, bạn không thể xóa nó.
                                                    </DialogContentText>
                                                    <TextField
                                                        autoFocus

                                                        margin="dense"
                                                        label="Danh mục"
                                                        type="text"
                                                        fullWidth
                                                        variant="standard"
                                                        value={newCategory?.name}
                                                        onChange={(e) => setNewCategory(prev => ({
                                                            ...prev,
                                                            name: e.target.value
                                                        }))}
                                                    />
                                                    <TextField

                                                        sx={{ mt: 3 }}
                                                        id="outlined-multiline-static"
                                                        label="Mô tả"
                                                        multiline
                                                        rows={4}
                                                        fullWidth
                                                        value={newCategory?.description}
                                                        onChange={(e) => setNewCategory(prev => ({
                                                            ...prev,
                                                            description: e.target.value
                                                        }))}
                                                    />
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handleCloseAddCategoryDialog}>Cancel</Button>
                                                    <Button onClick={handleCreateCategory}>Add category</Button>
                                                </DialogActions>

                                            </Dialog>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id="filled-textarea"
                                                variant="filled"
                                                label="Mô tả"
                                                multiline
                                                rows={3}
                                                fullWidth
                                                value={description} onChange={e => setDescription(e.target.value)}
                                            />
                                        </Grid>

                                        <Grid item xs={6}>
                                            <TableContainer component={Paper}>
                                                <Table size="small" >
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell align="center" colSpan={2}>
                                                                Thông số
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            specs.length > 0 && specs.map((spec, index) => {
                                                                return (
                                                                    <React.Fragment key={index}>
                                                                        <TableRow>
                                                                            <TableCell component="th" scope="row">
                                                                                {spec.key}
                                                                            </TableCell>
                                                                            <TableCell align="right">
                                                                                {spec.value}
                                                                            </TableCell>
                                                                            <TableCell align="right">
                                                                                <IndeterminateCheckBoxIcon style={{ cursor: 'pointer' }} fontSize="medium" color="error" onClick={() => handleDeleteSpecs(spec)}></IndeterminateCheckBoxIcon>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </React.Fragment>
                                                                )
                                                            })
                                                        }
                                                    </TableBody>
                                                    <TableFooter>
                                                        <TableRow>
                                                            <TableCell component="th" scope="row">
                                                                <TextField id="standard-basic" label="Key" value={keySpecs} variant="standard" onChange={event => setKeySpecs(event.target.value)} />
                                                            </TableCell>
                                                            <TableCell >
                                                                <TextField id="standard-basic" label="Value" value={valueSpecs} variant="standard" onChange={event => setValueSpecs(event.target.value)} />
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <AddBoxIcon style={{ cursor: 'pointer' }} fontSize="medium" color="primary" onClick={handleAddSpecs}></AddBoxIcon>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableFooter>
                                                </Table>
                                            </TableContainer>
                                            {errors.specs && <FormHelperText error>{errors.specs}</FormHelperText>}
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TableContainer component={Paper}>
                                                <Table size="small" >
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell align="center" colSpan={2}>
                                                                Giá bán
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            instock.length > 0 && instock.map((item, index) => {
                                                                return (
                                                                    <React.Fragment key={index}>
                                                                        <TableRow>
                                                                            <TableCell component="th" scope="row">
                                                                                {item.variant }
                                                                            </TableCell>
                                                                            <TableCell align="right">
                                                                                {item.quantity}
                                                                            </TableCell>
                                                                            <TableCell align="right">
                                                                                <IndeterminateCheckBoxIcon style={{ cursor: 'pointer' }} fontSize="medium" color="error" onClick={() => handleDeleteInstock(item)}></IndeterminateCheckBoxIcon>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </React.Fragment>
                                                                )
                                                            })
                                                        }
                                                    </TableBody>
                                                    <TableFooter>
                                                        <TableRow>
                                                            <TableCell component="th" scope="row">
                                                                <TextField id="standard-basic" label="Biến thể" variant="standard" value={colorInstock} onChange={event => setColorInstock(event.target.value)} />
                                                            </TableCell>
                                                            <TableCell >
                                                                <TextField id="standard-basic" type="number" label="Số lượng" variant="standard" value={quantityInstock} onChange={event => setQuantityInstock(event.target.value)} />
                                                            </TableCell>
                                                            <TableCell >
                                                                <TextField id="standard-basic" type="number" label="Giá" variant="standard" value={price} onChange={event => setPrice(event.target.value)} />
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <AddBoxIcon style={{ cursor: 'pointer' }} fontSize="medium" color="primary" onClick={handleAddInstock}></AddBoxIcon>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableFooter>
                                                </Table>
                                            </TableContainer>
                                            {errors.instock && <FormHelperText error>{errors.instock}</FormHelperText>}
                                        </Grid>
 <Grid item xs={3}>
            <TextField
                label="Hạn sử dụng"
                type="date"
                variant="standard"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
            />
        </Grid>
        <Grid item xs={3}>
            <TextField
                label="Ngày nhập"
                type="date"
                variant="standard"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={importDate}
                onChange={e => setImportDate(e.target.value)}
            />
        </Grid>
                                        <Grid item xs={1}></Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                id="standard-select-currency"
                                                select
                                                label="Loại thực phẩm này vẫn còn được bán chứ?"
                                                variant="standard"
                                                fullWidth
                                                value={isAvailable}
                                                onChange={e => setIsAvaiable(e.target.value)}
                                            >
                                                <MenuItem value="true">
                                                    có
                                                </MenuItem>
                                                <MenuItem value="false">
                                                    khong
                                                </MenuItem>
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseAddProductDialog}>Hủy bỏ</Button>
                                    <Button type="submit" onClick={handleAddProduct}>Đồng ý</Button>
                                </DialogActions>
                            </Dialog>
                        </React.Fragment>
                    </Fab>
                </Zoom>
            </Tooltip>
        </>

    );
}
