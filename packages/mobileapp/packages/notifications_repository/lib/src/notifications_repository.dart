import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:notifications_repository/src/functions.dart';
import 'package:notifications_repository/src/models/models.dart';

class NotificationsRepository {
  Future<void> setUpFirebase() async {
    await FirebaseMessaging.instance
        .subscribeToTopic(NotificationTopics.fiveMinutesBeforeEnd.name);
    await FirebaseMessaging.instance
        .subscribeToTopic(NotificationTopics.onAuctionEnd.name);

    FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);

    setForegroundNotifications();
  }

  Future<void> subscribeToTopic(NotificationTopics topic) async {
    return await FirebaseMessaging.instance.subscribeToTopic(topic.name);
  }

  Future<void> unsubscribeFromTopic(NotificationTopics topic) async {
    return await FirebaseMessaging.instance.unsubscribeFromTopic(topic.name);
  }

  Future<bool> hasIOSPermission() async {
    NotificationSettings settings =
        await FirebaseMessaging.instance.getNotificationSettings();

    if (settings.authorizationStatus.name == "authorized") {
      return true;
    } else {
      return false;
    }
  }

  /// Request notification permission via the dialog
  ///
  /// Return [true] if permission is granted. False otherwise
  Future<bool> requestIOSPermission() async {
    NotificationSettings settings =
        await FirebaseMessaging.instance.requestPermission(
      alert: true,
      announcement: true,
      badge: true,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
      sound: true,
    );

    if (settings.authorizationStatus.name == "authorized") {
      return true;
    } else {
      return false;
    }
  }
}
