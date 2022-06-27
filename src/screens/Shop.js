import React, {useEffect, useState} from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity,
        Pressable, Modal, Alert} from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  stretch: {
    width: 150,
    height: 150,
    paddingTop: 10
  },
  heading: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 50,
  },
  subHeading: {
    fontSize: 20,
    textAlign: 'center',
    //marginBottom: 5,
  },
  iconLayout: {
    marginTop: 110,
    justifyContent:'center',
    flex: 1,
    flexDirection: 'row',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  inline: {
    padding: 50,
    marginLeft: 20,
    marginTop: 120,
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

const ModalPopUp = ({visible, children}) => {
  const [showModal, setShowModal] = useState(visible);
  useEffect(() => {
    toggleModal();
  }, [visible]);
  const toggleModal = () => {
    if(visible) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };
  return (
  <Modal transparent visible={showModal}>
    <View style = {styles.modalBg}>
      <View style={[styles.modalContainer]}>
        {children}
      </View>
    </View>
  </Modal>
  );
};

export default function Shop() {
  const pressFunction = () => {
    setVisible(true)
  }
  const [visible, setVisible] = useState(false);

  return (
    <><View
      style={styles.container}>
      <Text style={styles.heading}>Mystery Long</Text>
      <Image style={styles.stretch}
        source={{
          uri: 'https://i.ibb.co/Z6dCZLc/Poster-3052022-59-4-84-1-cm-3.png',
        }} />
    </View>
    <View style={styles.inline}>
      <Text style={styles.subHeading}>Open for 100 coins?</Text> 
      <ModalPopUp visible={visible}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setVisible(false)}>
            <Icon name='close' size={30} colour="#000"/>
            </TouchableOpacity>            
          </View>
        </View>
        <View style = {{alignItems: 'center'}}>
        <Image source={{
          uri: 'https://i.ibb.co/XZNbJ3W/Wendy.png',
        }}
        style={{height: 150, width: 150, marginTop: 10}}/>
        </View>
        <Text style={{marginTop: 30, fontSize: 15, textAlign: 'center'}}> Congratulations!{'\n'}Dumpling has been added to your collection </Text>
        </ModalPopUp>     
      <TouchableOpacity onPress={() => pressFunction()}>
        <Icon name="checkcircleo" size={40} color="#000" />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => pressFunction()}>
        <Icon name="closecircleo" size={30} color="#000" />
        </TouchableOpacity> */}
      </View></>  
  );
}