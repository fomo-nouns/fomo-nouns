import 'package:hive/hive.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:settings_repository/src/models/models.dart';

class SettingsRepository {
  late Box _box;

  /// Must be called before working with other methods
  ///
  /// Opens the Hive boxes and prepares everything for work
  Future<void> prepareDb() async {
    Hive.registerAdapter(DbNotificationsStateAdapter());
    _box = await Hive.openBox(HiveSettingsBoxes.settings.name);

    int notExist = -1;
    var box = await Hive.openBox(HiveGeneralBoxes.saveData.name);
    int savedVersionCode =
        box.get(HiveGeneralKeys.versionCode.name, defaultValue: notExist);

    PackageInfo packageInfo = await PackageInfo.fromPlatform();
    int currentVersionCode = int.parse(packageInfo.buildNumber);

    if (savedVersionCode == notExist) {
      await _initializeDb();
    } else if (currentVersionCode > savedVersionCode) {
      await _updateDb();
    }

    box.put(HiveGeneralKeys.versionCode.name, currentVersionCode);
    return;
  }

  /// Load latest data stored in database
  Future<DbNotificationsState> load() async {
    DbNotificationsState state = _box.get(HiveNotificationsKeys.state.name);
    print(
        "-- Latest db state: \nonAuctionEnd: ${state.onAuctionEnd} \nfiveMinBeforeEnd: ${state.fiveMinBeforeEnd} \ntenMinBeforeEnd: ${state.tenMinBeforeEnd}");
    return _box.get(HiveNotificationsKeys.state.name);
  }

  /// Update data stored under [key] value
  /// and returns updated state
  Future<DbNotificationsState> update(DbNotificationsState state) async {
    _box.put(HiveNotificationsKeys.state.name, state);

    return load();
  }

  /// Function to be called only on first app launch
  ///
  /// Saves required data to database about settings state
  Future<void> _initializeDb() async {
    DbNotificationsState state = DbNotificationsState(
      onAuctionEnd: false,
      fiveMinBeforeEnd: false,
      tenMinBeforeEnd: false,
    );

    _box.put(HiveNotificationsKeys.state.name, state);

    return;
  }

  /// Loads missing required data into db that
  /// was added with the updates
  Future<void> _updateDb() async {
    return;
  }
}
