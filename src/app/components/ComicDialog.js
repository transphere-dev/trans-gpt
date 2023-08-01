import { Box, Center, Text , Image, useToast, Switch, FormLabel, FormControl} from '@chakra-ui/react'
import React, { useEffect ,useState } from 'react'

export default function ComicDialog({imagePath,dialog}) {
    const [imageLoading, setImageLoading] = useState(false);
    const [comicDialogImage, setComicDialogImage] = useState("");
    const toast = useToast();

  // fetch comic dialog image

  useEffect(() => {

    if(imagePath) {
        const imgData = {image_path: imagePath}

      try {
        const response =  fetch(`http://${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_PORT}/api/comics`,{
          method: 'POST',
          mode:"cors",
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(imgData)
        });
        response
        .then(data => {
          
          return data.json()
        })
        .then(data => {
          const comicData = data.data
          setComicDialogImage(comicData)
          setImageLoading(false)
        })
     
        .catch(e => {
          console.log(e.message)
          setImageLoading(false)
        })

        
      } catch (error) {
        setImageLoading(false)
        console.error( error);

        toast({
          // id,
          title: "Unable to fetch comic dialog image",
          duration: 7000,
          status: "warning",
        })
      }
    
    }
},[])

  return (
    <Box mt={'5%'} >
    <Image fallbackSrc='https://via.placeholder.com/150' src={comicDialogImage} />
    <FormControl mt={'5%'} display='flex' alignItems='center'>
  <FormLabel  htmlFor='dialog-box' mb='0'>
    Dialog box text
  </FormLabel>
  <Switch value={dialog} className='dialog-box' />
</FormControl>
    </Box>
  )
}
