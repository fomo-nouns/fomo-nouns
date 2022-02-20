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
    return await FirebaseMessaging.instance.subscribeToTopic(topic.name);
  }
}
