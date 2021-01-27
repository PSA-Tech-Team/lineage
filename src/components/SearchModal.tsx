import {
  Box,
  Button,
  Center,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { PSA_MEMBERS_WITH_IDS } from '../fixtures/Members';

const SearchModal = ({ changeLineage }: { changeLineage: Function }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen} mx={4}>
        Search lineages
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent overflowY="scroll" maxH="70vh">
          <ModalBody>
            <Input placeholder="Search lineages" my={4} />

            {PSA_MEMBERS_WITH_IDS.map((member, i) => (
              <Button
                key={i}
                onClick={() => {
                  changeLineage(i);
                  onClose();
                }}
                p={2}
                my={1}
                variant="ghost"
                isFullWidth
                textAlign="left"
              >
                <Text>{member.name}</Text>
              </Button>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchModal;
