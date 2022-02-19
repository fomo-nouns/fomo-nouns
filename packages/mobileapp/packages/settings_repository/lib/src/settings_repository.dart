import 'package:hive/hive.dart';
import 'package:settings_repository/src/models/models.dart';

class SettingsRepository {
  late Box _box;

  /// Must be called before working with other methods
  ///
  /// Opens the Hive boxes and prepares everything for work
  Future<void> prepareDb() async {
    _box = await Hive.openBox(HiveBoxes.settings.name);
    return;
  }

  /// Load latest data stored in database
  Future<Map<HiveKeys, bool>> load() async {
    Map<HiveKeys, bool> map = {};

    HiveKeys.values.forEach((key) {
      if (_box.containsKey(key)) {
        bool switchValue = _box.get(key);
        map.addAll({key: switchValue});
      }
    });

    return map;
  }

  /// Update data stored under [key] value
  /// and returns updated state
  Future<Map<HiveKeys, bool>> update(HiveKeys key, bool value) async {
    await _box.put(key, value);

    return load();
  }
}
