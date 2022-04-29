// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'web_data.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FomoNounsWebData _$FomoNounsWebDataFromJson(Map<String, dynamic> json) =>
    FomoNounsWebData(
      type: $enumDecode(_$WebDataTypeEnumMap, json['type']),
      background:
          $enumDecodeNullable(_$NounBackgroundEnumMap, json['background']),
    );

Map<String, dynamic> _$FomoNounsWebDataToJson(FomoNounsWebData instance) =>
    <String, dynamic>{
      'type': _$WebDataTypeEnumMap[instance.type],
      'background': _$NounBackgroundEnumMap[instance.background],
    };

const _$WebDataTypeEnumMap = {
  WebDataType.newNoun: 'newNoun',
  WebDataType.voteSent: 'voteSent',
};

const _$NounBackgroundEnumMap = {
  NounBackground.cool: 0,
  NounBackground.warm: 1,
};
