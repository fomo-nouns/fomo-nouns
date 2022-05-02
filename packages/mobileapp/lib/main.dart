import 'package:bot_toast/bot_toast.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:hydrated_bloc/hydrated_bloc.dart';
import 'package:mobileapp/app/colors.dart';
import 'package:mobileapp/app/const_names.dart';
import 'package:mobileapp/screens/home_screen.dart';
import 'package:mobileapp/screens/settings/vibration/cubit/vibration_cubit.dart';
import 'package:mobileapp/theme/cubit/theme_cubit.dart';
import 'package:notifications_repository/notifications_repository.dart';
import 'package:path_provider/path_provider.dart';
import 'package:settings_repository/settings_repository.dart';
import 'firebase_options.dart';

part 'main.g.dart';

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
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  _setForegroundNotifications();
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  await Hive.initFlutter();

  //TODO: delete if settings repository won't be used
  SettingsRepository settingsRepository = SettingsRepository();
  // await settingsRepository.prepareDb();

  //TODO: remove registration after end of notifications debug
  Hive.registerAdapter(NotificationMessageAdapter());
  await Hive.openBox<NotificationMessage>('notifications_test');

  final NotificationsRepository notificationsRepository =
      NotificationsRepository();

  // notificationsRepository.setUpFirebase();

  _setUpFirebase();

  // await FirebaseMessaging.instance.subscribeToTopic("fcm_debug");

  final storage = await HydratedStorage.build(
    storageDirectory: await getApplicationDocumentsDirectory(),
  );
  HydratedBlocOverrides.runZoned(
    () => runApp(
      App(
        notificationsRepository: notificationsRepository,
        settingsRepository: settingsRepository,
      ),
    ),
    storage: storage,
  );
}

class App extends StatelessWidget {
  const App({
    Key? key,
    required NotificationsRepository notificationsRepository,
    required SettingsRepository settingsRepository,
  })  : _notificationsRepository = notificationsRepository,
        _settingsRepository = settingsRepository,
        super(key: key);

  final NotificationsRepository _notificationsRepository;
  final SettingsRepository _settingsRepository;

  // This widget is the root of the application.
  @override
  Widget build(BuildContext context) {
    // Package require to initialize the BotToast here
    // Ref: https://github.com/MMMzq/bot_toast#Getting-started
    final botToastBuilder = BotToastInit();

    return ScreenUtilInit(
      designSize: const Size(390, 844),
      minTextAdapt: true,
      splitScreenMode: true,
      builder: () => MultiRepositoryProvider(
        providers: [
          RepositoryProvider<NotificationsRepository>.value(
            value: _notificationsRepository,
          ),
          RepositoryProvider<SettingsRepository>.value(
            value: _settingsRepository,
          ),
        ],
        child: MultiBlocProvider(
          providers: [
            BlocProvider<ThemeCubit>(
              create: (_) => ThemeCubit()..resetTheme(),
            ),
            BlocProvider<VibrationCubit>(
              create: (_) => VibrationCubit(),
            ),
          ],
          child: AnnotatedRegion<SystemUiOverlayStyle>(
            value: const SystemUiOverlayStyle(
              systemNavigationBarColor: Color(0xFF000000),
              systemNavigationBarIconBrightness: Brightness.light,
              statusBarColor: Colors.transparent,
              statusBarIconBrightness: Brightness.dark,
              statusBarBrightness: Brightness.light,
            ),
            child: BlocBuilder<ThemeCubit, Color>(
              builder: (context, color) {
                return MaterialApp(
                  builder: (context, widget) {
                    ScreenUtil.setContext(context);
                    Widget child = MediaQuery(
                      data:
                          MediaQuery.of(context).copyWith(textScaleFactor: 1.0),
                      child: widget!,
                    );
                    child = botToastBuilder(context, child);
                    return child;
                  },
                  title: 'Fomo Nouns',
                  debugShowCheckedModeBanner: false,
                  theme: ThemeData(
                    fontFamily: AppFonts.inter,
                    primaryColor: AppColors.textColor,
                    backgroundColor: color,
                  ),
                  initialRoute: '/',
                  routes: {
                    '/': (context) => const HomeScreen(),
                  },
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}
