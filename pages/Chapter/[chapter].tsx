import WordModal from '@/Components/Modals/WordModal';
import PassageAccordion from '@/Components/PassageAccordion';
import { RootState } from '@/store';
import { changeFocusMode, setSelectedWord, updateFocusMeaning, updateFocusModeNext, updateFocusModePrevious } from '@/store/slice';
import { Box, Button, Card, Center, Flex, HStack, ListItem, OrderedList, ScaleFade, Tag, Text, Tooltip, VStack, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { GetServerSideProps, GetStaticPaths, GetStaticPathsContext, GetStaticProps, InferGetStaticPropsType } from 'next';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { IoChevronForward } from "react-icons/io5";
import { IoChevronBack } from "react-icons/io5";
import { playAudio } from '@/utils';
import useSwipe from "@/Components/Swipe/useSwipe";
import { motion } from "framer-motion"
import { Chapter, chapters } from '@/data/chapters';
import ReactCardFlip from 'react-card-flip';



export const getStaticPaths = async () => {
  const paths = chapters.map((_, index) => ({
    params: { chapter: String(index + 1) },
  }))
  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const chapterNumber = params?.chapter;
  const chapter = chapters[Number(chapterNumber) - 1]
  return { props: { chapter, chapterNumber } }
}


const Comp = ({ chapter, chapterNumber }: { chapter: Chapter, chapterNumber: string }) => {

  const fontSize = useSelector((state: RootState) => state.fontSize);
  const focusMode = useSelector((state: RootState) => state.focusMode);
  const [isFlipped, setIsFlipped] = useState(false);

  const dispatch = useDispatch();
  const modalDisclosure = useDisclosure();

  const bg = useColorModeValue("primary.light", "primary.dark");

  const swipeHandlers = useSwipe(
    {
      onSwipedLeft: () => dispatch(updateFocusModeNext({ chapterLength: chapter.words.length })),
      onSwipedRight: () => dispatch(updateFocusModePrevious())
    });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowLeft":
          dispatch(updateFocusModePrevious())
          break;
        case "ArrowRight":
          dispatch(updateFocusModeNext({ chapterLength: chapter.words.length }))
          break;
        case " ":
          dispatch(updateFocusMeaning())
          break;
        case "Shift":
          dispatch(changeFocusMode())
          break;
        default:
          break;
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);


  return (
    <Box border="0px solid red" bg={bg} >

      <Box border="0px solid red">
        <Text> Chapter : {chapterNumber} ({chapter.words.length} words)</Text>
      </Box>

      {/* Focus Mode OFf */}
      <Flex flexWrap="wrap" border="0px solid red">
        {
          !focusMode.active && chapter.words.map((word, key) => {
            return (
              <Box m="10px" key={key} cursor="pointer">
                <Tooltip label={word.definition} placement='top' fontSize={fontSize} mt="5px">
                  <Tag
                    p="20px"
                    fontSize={fontSize}
                    onClick={() => {
                      dispatch(setSelectedWord(word))
                      modalDisclosure.onOpen()
                    }}
                  >
                    {word.word}
                  </Tag>
                </Tooltip>
              </Box>
            )
          })
        }
        <WordModal
          isOpen={modalDisclosure.isOpen}
          onClose={modalDisclosure.onClose}
        />
      </Flex>


      {/* Focus Mode ON */}
      {
        focusMode.active && chapter.words.map((word, key) => (
          <Box
            // border="1px solid red"
            key={key}
            py={{ base: "8px", md: "10px" }}
            w="full"
            display={key !== focusMode.index ? "none" : "block"}
            {...swipeHandlers}
          >

            <motion.div
              initial={{ opacity: 0.5, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
            >

              <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">

                <Card
                  mx="auto"
                  h={{ base: "full", md: "500px" }}
                  w={{ base: "full", md: "400px" }}
                  fontSize={{ base: "20px", md: "36px" }}
                  p={{ base: "12px", md: "24px" }}
                >

                  {
                    // !focusMode.showMeaning && (
                    <Center h={{ base: "300px", md: "500px" }}>
                      <Text fontSize="4xl" fontWeight={700}>
                        {word.word}
                      </Text>
                    </Center>
                    // )
                  }
                </Card>

                <Card
                  mx="auto"
                  h={{ base: "full", md: "500px" }}
                  w={{ base: "full", md: "400px" }}
                  fontSize={{ base: "20px", md: "36px" }}
                  p={{ base: "12px", md: "24px" }}
                >


                  {
                    // focusMode.showMeaning && (
                    // <Box h="full" fontSize="16px" >
                      <HStack fontSize="16px" minH={{ base: "full", md: "400px" }}>
                        <VStack >

                          <HStack w="full">
                            <Text> {word.word}</Text>
                            <Center cursor="pointer" onClick={() => playAudio(word.word)}>
                              🔊
                            </Center>
                          </HStack>

                          <Text w="full">
                            Description: {word.definition}
                          </Text>

                          <Text w="full">
                            Urdu Meaning: {word.urduMeaning}
                          </Text>

                          <Text w="full">
                            Sentences:
                          </Text>

                          <OrderedList w="full">
                            {
                              word.exampleSentences.map((sentence, key) => {
                                return (
                                  <ListItem key={key} ml="10px">
                                    {sentence}
                                  </ListItem>
                                )
                              })
                            }
                          </OrderedList>
                        </VStack>
                      </HStack>
                    // )
                  }
                </Card>

              </ReactCardFlip>


            </motion.div>


            <Text fontSize="12px" textAlign="center"> {key + 1} / {chapter.words.length} </Text>

            <HStack
              justify="center"
              py={{ base: "8px", md: "10px" }}
              mx="auto"
              maxW="400px"
              justifyContent="space-between"
            >
              <Button w="20" onClick={() => {
                dispatch(updateFocusModePrevious());
                setIsFlipped(false);
              }}>
                <IoChevronBack />
              </Button>
              <Button w="20" onClick={() => {
                dispatch(updateFocusMeaning());
                setIsFlipped(prevState => !prevState);
              }}>
                <Text fontSize="16px">
                  {focusMode.showMeaning ? "word" : "detail"}
                </Text>
              </Button>
              <Button w="20" onClick={() => {
                dispatch(updateFocusModeNext({ chapterLength: chapter.words.length }));
                setIsFlipped(false);
              }}>
                <IoChevronForward />
              </Button>
            </HStack>

          </Box>
        ))
      }

      {
        !focusMode.active && chapter.passages.length > 0 && (
          <Box mt="20px">
            <PassageAccordion passages={chapter.passages} />
          </Box>
        )
      }

    </Box >
  )

}


export default Comp;