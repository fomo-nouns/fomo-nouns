import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:notifications_repository/src/functions.dart';
import 'package:notifications_repository/src/models/models.dart';

class NotificationsRepository {
  Future setUpFirebase() async {
    await FirebaseMessaging.instance
        .subscribeToTopic(NotificationTopics.fiveMinutesBeforeEnd);
    await FirebaseMessaging.instance
        .subscribeToTopic(NotificationTopics.onAuctionEnd);

    FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);

    setForegroundNotifications();
  }

  Future subscribeToTopic(String topic) async {
    return await FirebaseMessaging.instance.subscribeToTopic(topic);
  }

  Future unsubscribeFromTopic(String topic) async {
    return await FirebaseMessaging.instance.subscribeToTopic(topic);
  }
}
