import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { getHouseholdByCode, getHouseholds } from '../api/household';
import { auth } from '../database/firebaseConfig';
import { Household } from '../store/houseHoldSlice';

export default function HouseholdOverviewScreen() {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [householdCode, setHouseholdCode] = useState('');
  const [error, setError] = useState('');
  const [isJoiningHousehold, setIsJoiningHousehold] = useState(false);
  const navigation = useNavigation();
  
  const navigateToHouseholdElementOverview = (household: Household) => {
    navigation.navigate('HouseholdElementOverviewScreen', { household });
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const theme = useTheme();

  useEffect(() => {
    async function fetchHouseholds() {
      const householdData = await getHouseholds();
      setHouseholds(householdData);
    }

    fetchHouseholds();
  }, []);

  const navigateAddNewHousehold = () => {
    navigation.navigate('AddNewHousehold');
  };

  // --- START OF CHECKHOUSEHOLDCODE --- //
  const joinHousehold = async () => {
    setError('');

    try {
      setIsJoiningHousehold(true);

      const household = await getHouseholdByCode(householdCode);

      if (household) {
        console.log('Hushåll hittat!!!');
        navigation.navigate('CreateProfileScreen', { household});
      } else {
        setError('Hushåll ej hittat');
      }
    } catch (error) {
      console.error('Något gick fel: ', error);
    } finally {
      setIsJoiningHousehold(false);
    }
  };
  // --- END OF CHECKHOUSEHOLDCODE --- //

  const modalContent = (
    <View>
      <TextInput
        placeholder='Ange kod'
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          width: 200,
          padding: 10,
          marginBottom: 10,
          fontSize: 25,
          textAlign: 'left',
          paddingLeft: 45,
        }}
        value={householdCode}
        onChangeText={(text) => {
          setHouseholdCode(text);
          setError('');
        }}
      />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <Button
        style={{ backgroundColor: 'green', zIndex: 2 }}
        onPress={joinHousehold}
        disabled={isJoiningHousehold}
      >
        Gå med i hushåll
      </Button>
    </View>
  );

  const BottomButtonBar = () => (
    <View style={styles.buttonBar}>
      <Button
        icon='plus-circle-outline'
        mode='contained'
        buttonColor={theme.colors.primary}
        onPress={navigateAddNewHousehold}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContent}
      >
        Lägg till nytt hushåll
      </Button>
      <Button
        icon='plus-circle-outline'
        mode='contained'
        buttonColor={theme.colors.primary}
        onPress={toggleModal}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContent}
      >
        Gå med i ett hushåll
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        ></View>
      </Button>
    </View>
  );

  const currentUserHouseholds = households.filter(
    (household) =>
      Array.isArray(household.userId) &&
      household.userId.some((id) => id === auth.currentUser?.uid)
  );

  return (
    <View>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {currentUserHouseholds.map((household) => (
          <Card
            key={household.id}
            style={styles.card}
            onPress={() => navigateToHouseholdElementOverview(household)}
          >
            <Card.Title title={household.name} />
          </Card>
        ))}
      </ScrollView>
      {isModalVisible && (
        <Modal animationType='slide' visible={isModalVisible}>
          <View style={styles.modalBackground}>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <View style={styles.modalContent}>{modalContent}</View>
          </View>
        </Modal>
      )}
      <BottomButtonBar />
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginTop: 10,
  },
  card: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  userIcons: {
    paddingRight: 20,
  },
  buttonBar: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginBottom: 40,
  },
  button: {
    marginHorizontal: 4,
    borderColor: 'rgb(242, 242, 242)',
    borderWidth: 1,
    borderRadius: 20,
  },
  buttonLabel: {
    fontSize: 18,
  },
  buttonContent: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 3,
  },
  closeButtonText: {
    fontSize: 24,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
