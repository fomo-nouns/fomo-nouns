import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:mobileapp/app/colors.dart';
import 'package:mobileapp/app/const_names.dart';
import 'package:mobileapp/screens/home_screen.dart';
import 'package:notifications_repository/notifications_repository.dart';
import 'package:settings_repository/settings_repository.dart';
import 'firebase_options.dart';

//TODO: remove class after end of notifications debug
@HiveType(typeId: 0)
class NotificationMessage {
  @HiveField(0)
  String? from;

  @HiveField(1)
  String? messageId;

  @HiveField(2)
  String? senderId;

  @HiveField(3)
  DateTime? sendTime;

  @HiveField(4)
  String? notificationTitle;

  @HiveField(5)
  String? notificationBody;
}

//TODO: remove class after end of notifications debug
class NotificationMessageAdapter extends TypeAdapter<NotificationMessage> {
  @override
  final int typeId = 0;

  @override
  NotificationMessage read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return NotificationMessage()
      ..from = fields[0] as String?
      ..messageId = fields[1] as String?
      ..senderId = fields[2] as String?
      ..sendTime = fields[3] as DateTime?
      ..notificationTitle = fields[4] as String?
      ..notificationBody = fields[5] as String?;
  }

  @override
  void write(BinaryWriter writer, NotificationMessage obj) {
    writer
      ..writeByte(6)
      ..writeByte(0)
      ..write(obj.from)
      ..writeByte(1)
      ..write(obj.messageId)
      ..writeByte(2)
      ..write(obj.senderId)
      ..writeByte(3)
      ..write(obj.sendTime)
      ..writeByte(4)
      ..write(obj.notificationTitle)
      ..writeByte(5)
      ..write(obj.notificationBody);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is NotificationMessageAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  // If you're going to use other Firebase services in the background, such as Firestore,
  // make sure you call `initializeApp` before using other Firebase services.
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  //TODO: remove after end of notifications debug
  await Hive.initFlutter();
  if (!Hive.isAdapterRegistered(NotificationMessageAdapter().typeId)) {
    Hive.registerAdapter(NotificationMessageAdapter());
  }
  late Box<NotificationMessage> box;
  if (Hive.isBoxOpen("notifications_test")) {
    box = Hive.box<NotificationMessage>('notifications_test');
  } else {
    box = await Hive.openBox<NotificationMessage>('notifications_test');
  }
  box.add(
    NotificationMessage()
      ..messageId = message.messageId
      ..from = message.from
      ..sendTime = message.sentTime
      ..senderId = message.senderId
      ..notificationTitle = message.notification?.title
      ..notificationBody = message.notification?.body,
  );
  print("Handling a background message: ${message.messageId}");
}

/// Setting HeadsUp(foreground) notifications show
Future _setForegroundNotifications() async {
  // For iOS
  await FirebaseMessaging.instance.setForegroundNotificationPresentationOptions(
    alert: true,
    badge: true,
    sound: true,
  );

  //For Android
  const AndroidNotificationChannel channel = AndroidNotificationChannel(
    'high_importance_channel',
    'High Importance Notifications',
    description: 'This channel is used for important notifications.',
    importance: Importance.max,
  );

  final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
      FlutterLocalNotificationsPlugin();

  await flutterLocalNotificationsPlugin
      .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin>()
      ?.createNotificationChannel(channel);
}

Future _setUpFirebase() async {
  await FirebaseMessaging.instance
      .subscribeToTopic(NotificationTopics.fiveMinutesBeforeEnd);
  await FirebaseMessaging.instance
      .subscribeToTopic(NotificationTopics.onAuctionEnd);

  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  _setForegroundNotifications();
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  await Hive.initFlutter();

  SettingsRepository settingsRepository = SettingsRepository();
  await settingsRepository.prepareDb();

  //TODO: remove registration after end of notifications debug
  Hive.registerAdapter(NotificationMessageAdapter());
  await Hive.openBox<NotificationMessage>('notifications_test');

  // final NotificationsRepository notificationsRepository =
  //     NotificationsRepository();

  // notificationsRepository.setUpFirebase();

  _setUpFirebase();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of the application.
  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(390, 844),
      minTextAdapt: true,
      splitScreenMode: true,
      builder: () => MaterialApp(
        builder: (context, widget) {
          ScreenUtil.setContext(context);
          return MediaQuery(
            data: MediaQuery.of(context).copyWith(textScaleFactor: 1.0),
            child: widget!,
          );
        },
        title: 'Fomo Nouns',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          fontFamily: AppFonts.inter,
          primaryColor: AppColors.textColor,
          backgroundColor: AppColors.warmBackground,
        ),
        initialRoute: '/',
        routes: {
          '/': (context) => const HomeScreen(),
        },
      ),
    );
  }
}
