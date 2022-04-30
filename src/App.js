import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  SimpleGrid,
  GridItem,
  Flex,
  theme,
  FormControl,
  Input,
  Heading,
  FormLabel,
  Button, ButtonGroup, Image,
  IconButton, Spacer,
  Menu, MenuButton, MenuList, MenuItem,
  UnorderedList, ListItem,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import { CloseIcon, ChevronDownIcon, DeleteIcon } from '@chakra-ui/icons';
import { ColorModeSwitcher } from './ColorModeSwitcher';

const itemCategoriesImageSrc = {
  Cuan: 'https://c.tenor.com/d_P1ag60gP8AAAAS/money-cash.gif',
  Mainan: 'https://c.tenor.com/kSL4F9JhG_0AAAAd/child-kid.gif',
  Pakaian: 'https://c.tenor.com/U4U7TPCwPvMAAAAi/lumiranda-lu-miranda-asesoria-de-imagen.gif',
  Makanan: 'https://c.tenor.com/EpRJuxA8bzEAAAAC/fast-food.gif',
  Kendaraan: 'https://c.tenor.com/bpXtT_w7ylwAAAAM/kids-playing-push.gif',
  Lainnya: 'https://c.tenor.com/3YskKw9SNLkAAAAC/skype-emoji.gif',
};

function App() {

  const [newItem, setNewItem] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [items, setItems] = useState(JSON.parse(localStorage.getItem('items')) || []);

  const [warning, setWarning] = useState([]);

  console.log(`newItem: ${newItem}`);
  console.log(localStorage.getItem('items'));
  console.log(newItemCategory, newItemCategory.length);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);


  function handleChangeNewItemName(e) {
    setNewItem(e.target.value);
  }

  function handleSelectCategory(e) {
    setNewItemCategory(e.target.innerHTML);
  }

  function handleClearInput() {
    setNewItem('');
    setNewItemCategory('');
  }

  function handleAddItem() {
    setItems([
      {
        name: newItem,
        category: newItemCategory || 'Lainnya',
      },
      ...items,
    ]);
    handleClearInput();
  }

  function clearItems() {
    setItems([]);
    setSelectedPrizeIdx(undefined)
    setShowPrize(false)
  }

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [removedItemIdx, setRemovedItemIdx] = useState(undefined);

  function removeItem(index) {
    setItems(items.filter((i, idx) => idx !== index));
    setRemovedItemIdx(undefined);
    onClose();
  }

  function confirmRemoveItem(index) {
    setRemovedItemIdx(index);
    onOpen();
  }

  const [showPrize, setShowPrize] = useState(false);
  const [loadingPrize, setLoadingPrize] = useState(false);
  const [selectedPrizeIdx, setSelectedPrizeIdx] = useState(undefined);

  function selectPrize() {
    setLoadingPrize(true);
    setSelectedPrizeIdx(Math.floor((Math.random() * items.length)));
    setShowPrize(true);
    setTimeout(() => {
      setLoadingPrize(false);
    }, 5000);
  }

  return (
    <ChakraProvider theme={theme}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            Konfirmasi
          </ModalHeader>
          <ModalBody>
            Yakin untuk menghapus <b>{items[removedItemIdx]?.name}</b>?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme={'red'} onClick={() => removeItem(removedItemIdx)}>
              Hapus Item
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box px={'15vw'} py={5} minH={'100vh'} textAlign={'center'} bgColor={'teal.400'}>
        <Heading marginX={'auto'} size={'4xl'} marginY={5} color={'whiteAlpha.800'}>
          RANDOMIZE YOUR ANGPAU!
        </Heading>

        {items.length >= 2 && showPrize && (
          <VStack marginBottom={5}>
            <Box
              height={200}
              width={200}
              borderRadius={5}
              borderWidth={2}
              borderColor={'blackAlpha.100'}
              backgroundColor={'blackAlpha.300'}
              overflow={'hidden'}
            >
              {loadingPrize ? (
                <Spinner
                  marginTop={75}
                  thickness='10px'
                  speed='0.35s'
                  emptyColor='gray.200'
                  color='yellow.500'
                  size='xl'
                />
              ) : (
                <Image
                  minW={'auto'}
                  minH={'100%'}
                  src={itemCategoriesImageSrc[items[selectedPrizeIdx]?.category]}
                />
              )}
            </Box>

            <Text color={'white'}>
              {loadingPrize ? 'Sedang memilih hadiah' : (
                <>
                  ~ ✨🎊🎉🎊✨ ~ <br/>
                  <hr style={{maxWidth: '200px', margin: '10px auto 20px'}}/>
                  Selamat anda memenangkan <b>{items[selectedPrizeIdx]?.name}</b>!
                  <hr style={{maxWidth: '200px', margin: '20px auto 10px'}}/>
                  ~ ✨🎊🎉🎊✨ ~
                </>
              )}
            </Text>
          </VStack>
        )}

        <ButtonGroup width={'100%'}>
          <Button width={'100%'} colorScheme={'yellow'} onClick={selectPrize} disabled={items.length < 2 || loadingPrize}>
            {items.length < 2 ? 'Masukkan Setidaknya 2 Item Terlebih Dahulu' : loadingPrize ? 'Mohon tunggu' : selectedPrizeIdx === undefined ? 'ACAK ANGPAU' : 'Coba Lagi'}
          </Button>
        </ButtonGroup>

        <form
          style={{ marginTop: '50px' }}
          onSubmit={(e) => {
            e.preventDefault();
            handleAddItem();
          }}
        >
          <Flex maxW={768} marginX={'auto'} marginBottom={20} flexWrap={'wrap'} justifyContent={'center'} gap={2}>
            <Input
              isRequired
              bgColor={'white'}
              placeholder='Masukkan nama item (Maks. 50 Karakter)'
              value={newItem}
              onChange={handleChangeNewItemName}
              maxLength={50}
            />
            <ButtonGroup gap={1} minW={300} w={'100%'} justifyContent={'center'}>
              <Menu>
                <MenuButton w={'100%'} as={Button} rightIcon={<ChevronDownIcon />} textAlign={'left'}>
                  {newItemCategory || 'Pilih kategori'}
                </MenuButton>
                <MenuList w={'100%'}>
                  <MenuItem onClick={handleSelectCategory}>Cuan</MenuItem>
                  <MenuItem onClick={handleSelectCategory}>Mainan</MenuItem>
                  <MenuItem onClick={handleSelectCategory}>Pakaian</MenuItem>
                  <MenuItem onClick={handleSelectCategory}>Makanan</MenuItem>
                  <MenuItem onClick={handleSelectCategory}>Kendaraan</MenuItem>
                  <MenuItem onClick={handleSelectCategory}>Lainnya</MenuItem>
                </MenuList>
              </Menu>
              <Button w={'30%'} colorScheme={'yellow'} type={'submit'}>
                Tambah
              </Button>
              <IconButton icon={<CloseIcon />} colorScheme={'red'} onClick={handleClearInput} />
            </ButtonGroup>
          </Flex>
        </form>

        <Box bgColor={'blackAlpha.300'} borderRadius={10} p={5}>
          <Heading color={'white'} mb={10}>
            Daftar Angpau Idaman
            <hr width={'40%'} style={{margin: 'auto', marginTop: '10px'}}/>
          </Heading>
          {items.length < 1 ? (
            <>
              <Heading size={'md'} color={'white'}>
                Belum ada pilihan angpau idaman kamu :'( <br />
              </Heading>
              <Text color={'white'} size={'xs'}>
                Yuk, tambah angpau dulu
              </Text>
            </>
          ) : (
            <>
              <SimpleGrid mb={10} minChildWidth={100} gap={3}>
                {items.map((item, idx) => {
                  return (
                    <GridItem key={idx} minH={140} width={110} bg={'white'} borderRadius={5} p={'5px'} marginX={'auto'}>
                      <VStack>
                        <Box
                          height={100}
                          borderRadius={5}
                          borderWidth={2}
                          borderColor={'blackAlpha.100'}
                          backgroundColor={'blackAlpha.300'}
                          overflow={'hidden'}
                        >
                          <Image
                            minW={'auto'}
                            minH={'100%'}
                            src={itemCategoriesImageSrc[item.category]}
                          />
                        </Box>
                        <Text fontSize='xs'>
                          {item.name}
                        </Text>
                      </VStack>
                      <IconButton
                        icon={<DeleteIcon />}
                        size={'xs'}
                        colorScheme={'red'}
                        variant={'ghost'}
                        onClick={() => confirmRemoveItem(idx)}
                      />
                    </GridItem>
                  );
                })}
              </SimpleGrid>
              <Button variant={'link'} colorScheme={'whiteAlpha'} onClick={clearItems}>
                Hapus Semua
              </Button>
            </>
          )}
        </Box>

      </Box>
    </ChakraProvider>
  );
}

export default App;
