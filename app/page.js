'use client'
import Image from "next/image"
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import {Box, Typography, Stack, Modal, TextField, Button} from '@mui/material'
import {collection, query, getDocs, doc, getDoc, setDoc, deleteDoc} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, SetOpen] = useState(true)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({id: doc.id, ...doc.data()})
    })
    setInventory(inventoryList)
    console.log(inventoryList)
  }
  useEffect(() => {
    updateInventory()
  }, [])

  const filteredInventory = inventory.filter(item =>
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const{quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
      }
      else{
        await setDoc(docRef, {quantity: 1})
      }
      await updateInventory()
    }
    

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const{quantity} = docSnap.data()
      if(quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    await updateInventory()
  }


  

  const handleOpen = () => SetOpen(true)
  const handleClose = () => SetOpen(false)
  
  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      bgcolor="#192841" // Dark blue background
      p={4}
    >
      <Modal
        open={open}
        onClose={handleClose}
        
      >
        <Box sx={style}>
          <Typography variant="h6" color = "black">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <TextField
        label="Search Items"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          width: '100%',
          maxWidth: '800px',
          mb: 2,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
            },
            '&:hover fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'white',
          },
          '& .MuiInputBase-input': {
            color: 'white',
          },
        }}
        InputLabelProps={{
          style: { color: 'white' },
        }}
      />
      <Box 
        border={'1px solid #333'} 
        width="100%" 
        maxWidth="800px" 
        display="flex" 
        flexDirection="column"
        sx={{ flexGrow: 1, maxHeight: 'calc(100vh - 200px)' }}
      >
        <Box
          width="100%"
          bgcolor={'#ADD8E6'}
          p={2}
        >
          <Typography variant={'h4'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack 
          width="100%" 
          spacing={2} 
          overflow={'auto'} 
          sx={{ flexGrow: 1 }}
        >
          {filteredInventory.map((item) => (
            <Box
              key={item.id}
              width="100%"
              minHeight="100px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              p={2}
            >
              <Typography variant={'h5'} color={'#333'} textAlign={'center'}>
                {item.id ? (item.id.charAt(0).toUpperCase() + item.id.slice(1)) : 'Unnamed Item'}
              </Typography>
              <Typography variant={'h5'} color={'#333'} textAlign={'center'}>
                {item.quantity || 0}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="contained" 
                  onClick={() => addItem(item.id)}
                >
                  Add
                </Button>
                <Button
                  variant="contained" 
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}