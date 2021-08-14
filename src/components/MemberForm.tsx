import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRef, useState } from 'react';
import * as yup from 'yup';
import { addMember } from '../client/membersService';
import { Member } from '../fixtures/Members';
import { YEARS } from '../fixtures/Semesters';

const memberSchema = yup.object().shape({
  name: yup.string().required(),
  classOf: yup.string().length(4).matches(RegExp('^[0-9]*$')).required(),
  adings: yup.number().required(),
  aks: yup.number().required(),
});

/**
 * Form to add members to database
 */
const MemberForm = ({
  refresh,
  membersList,
}: {
  refresh: () => Promise<Member[]>;
  membersList: Member[];
}) => {
  const [keepClass, setKeepClass] = useState<boolean>(false);
  const nameInput = useRef<HTMLInputElement>(null);
  const toast = useToast();

  return (
    <Formik
      initialValues={{
        name: '',
        classOf: '',
        adings: 0,
        aks: 0,
      }}
      validationSchema={memberSchema}
      onSubmit={async (values, actions) => {
        // Verify that member does not already exist
        const memberAlreadyExists = membersList.some(
          (member: Member) =>
            values.name.toLowerCase() === member.name.toLowerCase() &&
            values.classOf === member.classOf
        );

        // Return error notification if member exists
        if (memberAlreadyExists) {
          toast({
            title: 'Warning',
            description: `Member already exists!`,
            status: 'error',
          });

          // Prevent submission
          return;
        }

        // Add member to database
        const { name, classOf } = values;
        const { success, message, /* result */ } = await addMember(name, classOf);

        // Notify user through toast
        if (success) {
          toast({
            title: 'Success!',
            description: message,
            status: 'success',
          });
        } else {
          toast({
            title: 'Error',
            description: message,
            status: 'error',
          });
        }

        // Update UI
        actions.setSubmitting(false);
        actions.resetForm();

        // Reset class only if specified
        if (keepClass) actions.setFieldValue('classOf', values.classOf);

        nameInput.current?.focus();
        await refresh();  // TODO: instead of refreshing, add member to state
      }}
    >
      {({
        handleChange,
        handleReset,
        values,
        touched,
        errors,
        isSubmitting,
      }) => (
        <Form>
          {/* Name */}
          <FormControl
            id="name"
            isRequired
            isInvalid={Boolean(errors.name && touched.name)}
          >
            <FormLabel>Name</FormLabel>
            <Input
              id="name"
              placeholder="Ex: Renzo"
              value={values.name}
              onChange={handleChange}
              onReset={handleReset}
              ref={nameInput}
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          {/* Class */}
          <FormControl
            id="classOf"
            isRequired
            isInvalid={Boolean(errors.classOf && touched.classOf)}
            mt={2}
          >
            <FormLabel>Class of</FormLabel>
            <Select
              value={values.classOf}
              onChange={handleChange}
              onReset={handleReset}
            >
              {YEARS.map((year) => year.toString()).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.classOf}</FormErrorMessage>
          </FormControl>

          <Checkbox my={2} onChange={() => setKeepClass(!keepClass)}>
            Keep class after submission
          </Checkbox>

          <Flex>
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export default MemberForm;
