import 'package:json_annotation/json_annotation.dart';

part 'web_data.g.dart';

enum NounBackground {
  @JsonValue(0)
  cool,
  @JsonValue(1)
  warm,
}

enum WebDataType {
  @JsonValue('newNoun')
  newNoun,
  @JsonValue('voteSent')
  voteSent,
}

extension WebDataTypeX on WebDataType {
  bool get isNewNoun => this == WebDataType.newNoun;
  bool get isVoteSent => this == WebDataType.voteSent;
}

@JsonSerializable()
class FomoNounsWebData {
  @JsonValue('type')
  final WebDataType type;

  @JsonValue('background')
  final NounBackground? background;

  const FomoNounsWebData({
    required this.type,
    this.background,
  });

  factory FomoNounsWebData.fromJson(Map<String, dynamic> json) =>
      _$FomoNounsWebDataFromJson(json);

  Map<String, dynamic> toJson() => _$FomoNounsWebDataToJson(this);
}
