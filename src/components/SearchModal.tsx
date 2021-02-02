import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Member } from '../fixtures/Members';

interface SearchModalProps { 
  members: Member[], 
  onSelect: (memberId: string) => void 
}

const SearchModal = ({ members, onSelect }: SearchModalProps) => {
  const [nameQuery, setNameQuery] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const closeModal = () => {
    onClose();
    setNameQuery('');
  };

  const filterMembers = (member: Member) => {
    const hasName = member.name.toLowerCase().includes(nameQuery.toLowerCase());
    const hasYear = member.classOf.includes(nameQuery);

    return hasName || hasYear;
  };

  return (
    <>
      <Button onClick={onOpen} mx={4}>
        <SearchIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent overflowY="auto" maxH="70vh">
          <ModalBody>
            <Input
              placeholder="Search members"
              my={4}
              size="sm"
              onChange={(e) => setNameQuery(e.target.value)}
            />

            {members.filter(filterMembers).map((member, i) => (
              <Box key={i}>
                <Button
                  onClick={() => {
                    onSelect((member.id || i).toString());
                    onClose();
                    setNameQuery('');
                  }}
                  my={1}
                  variant="ghost"
                  isFullWidth
                  textAlign="left"
                >
                  <Text>{`${member.name} (${member.classOf})`}</Text>
                </Button>
                <Divider />
              </Box>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchModal;
