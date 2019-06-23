# Quiz Me

Quiz app for Android and iOS. Install the base packages from `QuizMe`.

```
npm install
react-native link
```

## Configure Firebase for Android/iOS

Use the [Firebase Console](https://console.firebase.google.com) to set up two apps, one for Android, the other for iOS. During this process you will create the following files, which are not source controlled:

* `GoogleService-Info.plist` (iOS)
* `google-services.json` (Android)

Note that most of the rest of the setup required for FCM should already be configured in the repository.


# Build for Android

## Configure Build

Navigate to `QuizMe/android/app` and build a keystore and assign it a password:

```
keytool -genkeypair -v -keystore quiz-me.keystore -alias quiz-me-key -keyalg RSA -keysize 2048 -validity 10000
```

Create `QuizMe/android/app/gradle.properties` and add the following:

```
RELEASE_STORE_FILE=quiz-me.keystore
RELEASE_KEY_ALIAS=quiz-me-key
```

### Plain Text Password

This isn't recommended, but the easiest way to configure is by specifying the passwords in plain text:

```
RELEASE_STORE_PASSWORD=password
RELEASE_KEY_PASSWORD=password
```

### Mac Keychain Password

The more secure way (when using a Mac) is to use the Keychain Access app. Configure a password in a new
keychain called `quizme_keystore`, specifying your Mac username.

Then in `gradle.properties` add the following references:

```
RELEASE_MAC_KEYCHAIN=quizme_keystore
MAC_ADMIN_USER=Nesh Patel
```

## Add SHA Fingerprints to Firebase

In order to use Google Sign In features with Firebase, add the SHA keys from your keystore to the Project 
Settings in the [Firebase Console](https://console.firebase.google.com). To get your SHA fingerprints,
run the following for your release keystore. Add both SHA-1 and SHA-256 fingerprints.

```
keytool -exportcert -list -v -alias quiz-me-key -keystore android/keystores/quiz-me.keystore
```


## Increase Memory for Build

If you experience the error `Expiring Daemon because JVM Tenured space is exhausted` when building the app, 
add the followingto `gradle.properties`:

```
org.gradle.jvmargs=-Xmx2048M -XX\:MaxHeapSize\=10g`
```


## Build App

Once the configuration in the previous section is done, navigate to `QuizMe/android` and
run the following to build the app:

```
./gradlew assembleRelease
```

The release APK will be created at `QuizMe/android/app/build/outputs/apk/release/app-release.apk`.

