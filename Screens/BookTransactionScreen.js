/** @format */

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ToastAndroid,
  Alert,
} from "react-native";
import { Rajdhani_600SemiBold } from "@expo-google-fonts/rajdhani";
import { BarCodeScanner } from "expo-barcode-scanner";
import db from "../config";

const bgImg = require("../assets/background2.png");
const appIcon = require("../assets/appIcon.png");
const appName = require("../assets/appName.png");

const BookTransactionScreen = (props) => {
  const [hasPermissions, setHasPermissions] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanStudentId, setScanStudentId] = useState("normal");
  const [scanBookId, setScanBookId] = useState("normal");
  const [studentId, setstudentId] = useState("");
  const [bookId, setbookId] = useState("");
  const [bookDetails, setBookDetails] = useState({});
  //const [transactionMessage, setTransactionMessage] = useState("");

  console.log(hasPermissions, scanned, bookId);

  const handlePermissions = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermissions(status === "granted");
    setScanned(false);
  };

  const handleTransactions = async () => {
    console.log("inside handle transactions, bookId is ", bookId);
    db.collection("books")
      .doc(bookId)
      .get()
      .then((doc) => {
        var { book_details } = doc.data();
        console.log("bookdetails", book_details);
        if (book_details.is_book_available) {
          initiateBookIssue();
          transactionMessage = "Book Issued";
          Alert.alert("Book Issued");
          // ToastAndroid.show(transactionMessage, ToastAndroid.SHORT);
        } else {
          initiateBookReturn();
          transactionMessage = "Book Returned";
          Alert.alert("Book Returned");
          //ToastAndroid.show(transactionMessage, ToastAndroid.SHORT);
        }
      })
      .catch((error) => {
        console.log("error while getting book details");
      });
    //setTransactionMessage(transactionMessage);
  };

  const initiateBookIssue = async () => {
    db.collection("transactions")
      .add({
        student_id: studentId,
        book_id: bookId,
        date: firebase.firestore.Timestamp.now().toDate(),
        transaction_type: "issue",
      })
      .then((docRef) => {
        console.log("Book Return Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document while issuing book: ", error);
      });

    //change the book availability status
    db.collection("books")
      .doc(bookId)
      .update({ book_details: { is_book_available: false } })
      .then(() => {
        console.log(
          "Book Availability successfully updated while Issuing the book!"
        );
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error(
          "Error updating book document while issuing the book: ",
          error
        );
      });

    // change number of books issued to the student

    db.collection("students")
      .doc(studentId)
      .update({
        number_of_books_issued: firebase.firestore.FieldValue.increment(1),
      })
      .then(() => {
        console.log(
          "Number of books issued  successfully updated,after issuing the book!"
        );
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error(
          "Error updating Student document while issuing the book ",
          error
        );
      });
    setbookId("");
    setstudentId("");
  };

  const initiateBookReturn = () => {
    db.collection("transactions")
      .add({
        student_id: studentId,
        book_id: bookId,
        date: firebase.firestore.Timestamp.now().toDate(),
        transaction_type: "return",
      })
      .then((docRef) => {
        console.log("Book Return Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document while returning book: ", error);
      });

    //change the book availability status
    db.collection("books")
      .doc(bookId)
      .update({ is_book_available: true })
      .then(() => {
        console.log("Book Availability successfully updated!");
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });

    // change number of books issued to the student

    db.collection("students")
      .doc(studentId)
      .update({
        number_of_books_issued: firebase.firestore.FieldValue.increment(-1),
      })
      .then(() => {
        console.log(
          "Number of books issued  successfully updated,after issuing the book!"
        );
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error(
          "Error updating Student document while issuing the book ",
          error
        );
      });
    setbookId("");
    setstudentId("");
  };

  const handleScan = async ({ type, data }) => {
    console.log("inside handle scan");
    if (scanBookId === "clicked") {
      setbookId(data);
      setScanned(true);
      setScanBookId("normal");
    } else if (scanStudentId === "clicked") {
      setstudentId(data);
      setScanned(true);
      setScanStudentId("normal");
    }
  };

  if (
    (scanBookId === "clicked" || scanStudentId === "clicked") &&
    hasPermissions
  ) {
    console.log("inside bar code scanner");
    console.log("scanned is", scanned);
    return (
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleScan}
        style={StyleSheet.absoluteFillObject}
      />
    );
  }

  return (
    <ImageBackground source={bgImg} style={styles.bgImage}>
      <View style={styles.upperContainer}>
        <Image source={appIcon} style={styles.appIcon} />
        <Image source={appName} style={styles.appName} />
      </View>
      <View style={styles.lowerContainer}>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Book Id"
            placeholderTextColor="#ffff"
            onChangeText={(text) => {
              setbookId(text);
            }}
            value={bookId}
          />
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => {
              setScanBookId("clicked");
              handlePermissions();
            }}
          >
            <Text style={styles.scanButtonText}> Scan</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.textInputContainer, { marginTop: 20 }]}>
          <TextInput
            style={styles.textInput}
            placeholder="Student Id"
            placeholderTextColor="#ffff"
            onChangeText={(text) => {
              setstudentId(text);
            }}
            value={studentId}
          />
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => {
              setScanStudentId("clicked");
              handlePermissions();
            }}
          >
            <Text style={styles.scanButtonText}> Scan</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => {
          handleTransactions();
        }}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  appIcon: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 80,
  },
  appName: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  bgImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  lowerContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  scanButton: {
    width: 100,
    height: 50,
    backgroundColor: "#9DFD24",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  scanButtonText: {
    fontSize: 24,
    fontFamily: "Rajdhani_600SemiBold",
    color: "#0A0101",
  },
  submitButton: {
    width: "43%",
    height: 55,
    backgroundColor: "#f4d820",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 15,
    marginBottom: 50,
  },
  submitButtonText: {
    fontSize: 24,
    color: "#fff",
    fontFamily: "Rajdhani_600SemiBold",
    textAlign: "center",
  },

  textInputContainer: {
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#9DFD24",
    borderColor: "#FFFFFF",
  },
  textInput: {
    width: "57%",
    height: 50,
    padding: 10,
    borderColor: "#fff",
    justifyContent: "center",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    fontSize: 18,
    backgroundColor: "#5653d4",
    fontFamily: "Rajdhani_600SemiBold",
    color: "#fff",
  },
  upperContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BookTransactionScreen;
