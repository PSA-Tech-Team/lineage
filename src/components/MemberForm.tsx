import {
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
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import * as yup from 'yup';
import { addMember } from '../client/membersService';
import { Member } from '../fixtures/Members';
import { YEARS } from '../fixtures/Semesters';
import GradientButton from './GradientButton';

const memberSchema = yup.object().shape({
  name: yup.string().required(),
  classOf: yup.string().length(4).matches(RegExp('^[0-9]*$')).required(),
  adings: yup.number().required(),
  aks: yup.number().required(),
});

interface MemberFormProps {
  members: Member[];
  setMembers: Dispatch<SetStateAction<Member[]>>;
}

/**
 * Form to add members to database
 */
const MemberForm = ({ members, setMembers }: MemberFormProps) => {
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
        const memberAlreadyExists = members.some(
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
        const { success, message, member } = await addMember(name, classOf);

        // Notify user through toast
        if (success) {
          toast({
            title: 'Success!',
            description: message,
            status: 'success',
          });

          // Add member to state
          if (member !== undefined) setMembers([...members, member]);
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

        // Focus back on name field
        nameInput.current?.focus();
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
            <GradientButton mt={4} isLoading={isSubmitting} type="submit">
              Submit
            </GradientButton>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export default MemberForm;
