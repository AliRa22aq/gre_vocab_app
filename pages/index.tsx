import { Box, Flex, Tag, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import QuizModal from '@/Components/Modals/QuizModal';
import { updateQuizChapter } from '@/store/slice';


export default function Home() {

  const chapters = useSelector((state: RootState) => state.chapters);
  const dispatch = useDispatch();
  const router = useRouter();
  const bg = useColorModeValue("primary.light", "primary.dark");

  const quizModalDisclosure = useDisclosure();

  return (
    <Box bg={bg}>
      {
        [...Array(chapters.length)].map((_, key) => {
          const chapterNumber = key + 1;
          return (
            <Flex justify="space-between" w={{ md: "300px" }} mx="auto" key={key} border="1px solid grey" my="10px"  >
              <Text
                fontWeight="bold"
                p="10px"
                w="50%"
                bgColor="gray.500"
                cursor="pointer"
                onClick={() => {
                  router.push(`/Chapter/${chapterNumber}`)
                }}
                textAlign="center"
              >
                Chapter: {chapterNumber}
              </Text>

              <Tag
                m="5px"
                cursor="pointer"
                onClick={() => {
                  dispatch(updateQuizChapter({ chapter: chapters[key], quizNumber: chapterNumber }))
                  quizModalDisclosure.onOpen();
                }}
              >
                quiz
              </Tag>


            </Flex>
          )
        })
      }
      <QuizModal
        isOpen={quizModalDisclosure.isOpen}
        onClose={quizModalDisclosure.onClose}
      />
    </Box>
  )
}
