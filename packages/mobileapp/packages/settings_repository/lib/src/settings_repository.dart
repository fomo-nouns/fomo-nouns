import 'package:hive/hive.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:settings_repository/src/models/models.dart';

class SettingsRepository {
  late Box _box;

  /// Must be called before working with other methods
  ///
  /// Opens the Hive boxes and prepares everything for work
  Future<void> prepareDb() async {
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
  Future<Map<HiveNotificationsKeys, bool>> load() async {
    Map<HiveNotificationsKeys, bool> map = {};

    HiveNotificationsKeys.values.forEach((key) {
      if (_box.containsKey(key.name)) {
        bool switchValue = _box.get(key.name);
        map.addAll({key: switchValue});
      }
    });

    return map;
  }

  /// Update data stored under [key] value
  /// and returns updated state
  Future<Map<HiveNotificationsKeys, bool>> update(
      HiveNotificationsKeys key, bool value) async {
    await _box.put(key.name, value);

    return load();
  }

  /// Function to be called only on first app launch
  ///
  /// Saves required data to database about settings state
  Future<void> _initializeDb() async {
    HiveNotificationsKeys.values.forEach((key) {
      _box.put(key.name, false);
    });

    return;
  }

  /// Loads missing required data into db that
  /// was added with the updates
  Future<void> _updateDb() async {
    return;
  }
}
