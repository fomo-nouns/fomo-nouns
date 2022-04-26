import 'package:json_annotation/json_annotation.dart';

enum NounBackground {
  @JsonValue('0')
  cool,
  @JsonValue('1')
  warm,
}

@JsonSerializable()
class FomoNounsWebData {
  final NounBackground background;

  const FomoNounsWebData({
    required this.background,
  });
}
