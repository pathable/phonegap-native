Convert Trigger.io to PhoneGap
====================

This repository is to build a PhoneGap project in PhoneGap Build that generates native iOS and Android builds of one of special sites, and do it in a way where we can take the project files, replace them with the mobile web URLs of our other sites, and generate similar apps on an ongoing basis. 


Installation
------------

### Dependencies

```
$ bundle install
$ npm install -g cordova@4.3.0
$ npm install -g appium
$ npm install -g ios-sim
$ npm install
```

### Configuration

```
$ cp config.sample.xml config.xml
```

### Platforms

You'll need to install the JRE/JDK to build android. I installed `jre-8u40-macosx-x64.dmg` and `jdk-8u40-macosx-x64.dmg`.

Assuming you have OSX and Homebrew installed, you can install the Android SDK (needed in order to add the platform) pretty easily with:

```
$ brew install android-sdk
```

You should add something similar to the following to your `.bash_profile`:

```
export ANDROID_HOME="/usr/local/Cellar/android-sdk/24.0.2"
export PATH=$PATH:$ANDROID_HOME/bin
export JAVA_HOME=$(/usr/libexec/java_home)
```

Then run the android tool to install the SDK.

```
$ android
```

Install the following:

1. "SDK Platform" for android-21
2. "Android SDK Platform-tools (latest)
3. "Android SDK Build-tools" (latest)]

You also need to install ant to run the Android build (`brew install ant`).

After that (and also assuming you're on OSX) then you can add the iOS and Android platforms as such:

```
$ cordova platform add ios
$ cordova platform add android
```

After adding the iOS platform, you'll want to set up the code signing. Open the XCode project (`open platforms/ios/<project name>.xcodeproj`) and pick your provisioning profile, etc. You'll only need to do this once.


Copyright
---------

Copyright (c) 2015 Alexander B.
